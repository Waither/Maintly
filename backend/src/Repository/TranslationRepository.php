<?php

namespace App\Repository;

use App\Entity\Translation;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TranslationRepository extends ServiceEntityRepository {
    public function __construct(ManagerRegistry $registry) {
        parent::__construct($registry, Translation::class);
    }

    /**
     * Get all translations for a specific locale as associative array
     * Falls back to English if translation not found.
     *
     * @param string $locale Target locale (e.g., 'pl', 'en')
     *
     * @return array<string, string> ['message_key' => 'translated text']
     */
    public function getAllForLocale(string $locale): array {
        $translations = [];

        // Get all English translations (fallback)
        $englishResults = $this->createQueryBuilder('t')
            ->where('t.locale = :locale')
            ->setParameter('locale', 'en')
            ->getQuery()
            ->getResult();

        foreach ($englishResults as $translation) {
            $translations[$translation->getMessageKey()] = $translation->getText();
        }

        // Override with requested locale if not English
        if ($locale !== 'en') {
            $localeResults = $this->createQueryBuilder('t')
                ->where('t.locale = :locale')
                ->setParameter('locale', $locale)
                ->getQuery()
                ->getResult();

            foreach ($localeResults as $translation) {
                $translations[$translation->getMessageKey()] = $translation->getText();
            }
        }

        return $translations;
    }

    public function save(Translation $translation, bool $flush = false): void {
        $this->getEntityManager()->persist($translation);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Translation $translation, bool $flush = false): void {
        $this->getEntityManager()->remove($translation);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
