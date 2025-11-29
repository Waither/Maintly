<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Report;
use App\Message\GenerateReportMessage;
use App\Repository\ReportRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/reports', name: 'api_reports_')]
#[IsGranted('ROLE_USER')]
class ReportController extends AbstractController {
    use ApiResponseTrait;

    public function __construct(
        private readonly MessageBusInterface $commandBus,
        private readonly EntityManagerInterface $entityManager,
        private readonly ReportRepository $reportRepository,
        private readonly SerializerInterface $serializer,
        private readonly string $reportsDir,
    ) {}

    /**
     * Generate a report asynchronously.
     *
     * Request body example:
     * {
     *   "reportType": "maintenance",
     *   "format": "pdf",
     *   "filters": {
     *     "status": "completed",
     *     "dateFrom": "2025-01-01",
     *     "dateTo": "2025-12-31"
     *   }
     * }
     */
    #[Route('/generate', name: 'generate', methods: ['POST'])]
    public function generate(Request $request): JsonResponse {
        $data = json_decode($request->getContent(), true);

        // Validate required fields
        if (!isset($data['reportType']) || !isset($data['format'])) {
            return $this->validationErrorResponse(
                'error.report.missing_fields',
                ['fields' => 'reportType, format'],
            );
        }

        // Validate report type
        $allowedTypes = ['maintenance', 'equipment', 'users'];
        if (!in_array($data['reportType'], $allowedTypes, true)) {
            return $this->validationErrorResponse(
                'error.report.invalid_type',
                ['allowedValues' => $allowedTypes],
            );
        }

        // Validate format
        $allowedFormats = ['pdf', 'excel', 'csv'];
        if (!in_array($data['format'], $allowedFormats, true)) {
            return $this->validationErrorResponse(
                'error.report.invalid_format',
                ['allowedValues' => $allowedFormats],
            );
        }

        // Create Report entity
        /** @var \App\Entity\User $user */
        $user = $this->getUser();
        $report = new Report();
        $report->setUser($user);
        $report->setReportType($data['reportType']);
        $report->setFormat($data['format']);
        $report->setFilters($data['filters'] ?? []);
        $report->setStatus('pending');

        $this->entityManager->persist($report);
        $this->entityManager->flush();

        // Dispatch async message
        $message = new GenerateReportMessage(
            reportId: $report->getId(),
            reportType: $data['reportType'],
            format: $data['format'],
            filters: $data['filters'] ?? [],
            outputPath: $data['outputPath'] ?? null,
        );

        $this->commandBus->dispatch($message);

        return $this->successResponse(
            data: [
                'id' => $report->getId(),
                'reportType' => $report->getReportType(),
                'format' => $report->getFormat(),
                'status' => $report->getStatus(),
                'createdAt' => $report->getCreatedAt()->format('c'),
            ],
            code: 202,
            message: 'success.report.generation_started',
        );
    }

    /**
     * Get list of user's reports.
     */
    #[Route('', name: 'list', methods: ['GET'])]
    public function list(Request $request): JsonResponse {
        $user = $this->getUser();
        assert($user instanceof \App\Entity\User);

        $page = max(1, (int) $request->query->get('page', 1));
        $limit = min(100, max(1, (int) $request->query->get('limit', 20)));
        $offset = ($page - 1) * $limit;

        $reports = $this->reportRepository->findByUser($user, $limit, $offset);
        $total = $this->reportRepository->countByUser($user);

        return $this->successResponse(
            data: [
                'reports' => json_decode($this->serializer->serialize($reports, 'json', ['groups' => 'report:read']), true),
                'pagination' => [
                    'currentPage' => $page,
                    'totalPages' => (int) ceil($total / $limit),
                    'totalItems' => $total,
                    'itemsPerPage' => $limit,
                ],
            ],
            message: 'report.list.retrieved',
        );
    }

    /**
     * Get single report details.
     */
    #[Route('/{id}', name: 'show', methods: ['GET'])]
    public function show(int $id): JsonResponse {
        $user = $this->getUser();
        assert($user instanceof \App\Entity\User);

        $report = $this->reportRepository->find($id);

        if (!$report) {
            return $this->notFoundResponse('error.report.not_found');
        }

        // Check ownership
        if ($report->getUser()->getId() !== $user->getId()) {
            return $this->forbiddenResponse('error.report.access_denied');
        }

        return $this->successResponse(
            data: json_decode($this->serializer->serialize($report, 'json', ['groups' => 'report:read']), true),
            message: 'report.show.retrieved',
        );
    }

    /**
     * Download generated report file.
     */
    #[Route('/{id}/download', name: 'download', methods: ['GET'])]
    public function download(int $id): BinaryFileResponse|JsonResponse {
        $user = $this->getUser();
        assert($user instanceof \App\Entity\User);

        $report = $this->reportRepository->find($id);

        if (!$report) {
            return $this->notFoundResponse('error.report.not_found');
        }

        // Check ownership
        if ($report->getUser()->getId() !== $user->getId()) {
            return $this->forbiddenResponse('error.report.access_denied');
        }

        // Check if completed
        if (!$report->isCompleted()) {
            return $this->errorResponse(
                message: 'error.report.not_ready',
                code: 400,
                errors: ['status' => $report->getStatus()],
            );
        }

        $filePath = $this->reportsDir . '/' . $report->getFileName();

        if (!file_exists($filePath)) {
            return $this->notFoundResponse('error.report.file_not_found');
        }

        return $this->file($filePath, $report->getFileName(), ResponseHeaderBag::DISPOSITION_ATTACHMENT);
    }

    /**
     * Delete report and file.
     */
    #[Route('/{id}', name: 'delete', methods: ['DELETE'])]
    public function delete(int $id): JsonResponse {
        $user = $this->getUser();
        assert($user instanceof \App\Entity\User);

        $report = $this->reportRepository->find($id);

        if (!$report) {
            return $this->notFoundResponse('error.report.not_found');
        }

        // Check ownership
        if ($report->getUser()->getId() !== $user->getId()) {
            return $this->forbiddenResponse('error.report.access_denied');
        }

        // Delete file if exists
        if ($report->getFileName()) {
            $filePath = $this->reportsDir . '/' . $report->getFileName();
            if (file_exists($filePath)) {
                unlink($filePath);
            }
        }

        // Delete from database
        $this->entityManager->remove($report);
        $this->entityManager->flush();

        return $this->successResponse(
            data: ['id' => $id],
            message: 'success.report.deleted',
        );
    }

    /**
     * Get available report types and formats.
     */
    #[Route('/options', name: 'options', methods: ['GET'])]
    public function options(): JsonResponse {
        return $this->successResponse(
            data: [
                'reportTypes' => [
                    [
                        'id' => 'maintenance',
                        'name' => 'report.type.maintenance',
                        'description' => 'report.type.maintenance_description',
                        'availableFilters' => ['status', 'dateFrom', 'dateTo', 'equipmentId'],
                    ],
                    [
                        'id' => 'equipment',
                        'name' => 'report.type.equipment',
                        'description' => 'report.type.equipment_description',
                        'availableFilters' => ['costCenter'],
                    ],
                    [
                        'id' => 'users',
                        'name' => 'report.type.users',
                        'description' => 'report.type.users_description',
                        'availableFilters' => ['role'],
                    ],
                ],
                'formats' => [
                    ['id' => 'pdf', 'name' => 'report.format.pdf', 'extension' => 'pdf'],
                    ['id' => 'excel', 'name' => 'report.format.excel', 'extension' => 'xlsx'],
                    ['id' => 'csv', 'name' => 'report.format.csv', 'extension' => 'csv'],
                ],
            ],
            message: 'report.options.retrieved',
        );
    }
}
