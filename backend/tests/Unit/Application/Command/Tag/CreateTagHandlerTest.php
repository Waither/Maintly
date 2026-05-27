<?php

declare(strict_types=1);

namespace App\Tests\Unit\Application\Command\Tag;

use App\Application\Command\Tag\CreateTagCommand;
use App\Application\Command\Tag\CreateTagHandler;
use App\Entity\Tag;
use App\Entity\TagGroup;
use App\Repository\TagGroupRepository;
use Doctrine\ORM\EntityManagerInterface;
use PHPUnit\Framework\TestCase;

class CreateTagHandlerTest extends TestCase {
    public function testCreatesTagWithoutGroup(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(TagGroupRepository::class);

        $em->expects($this->once())->method('persist')
            ->with($this->isInstanceOf(Tag::class));
        $em->expects($this->once())->method('flush');

        $handler = new CreateTagHandler($em, $repo);
        $result = $handler(new CreateTagCommand(name: 'Electrical', color: '#ff0000'));

        $this->assertSame('Electrical', $result->getName());
        $this->assertSame('#ff0000', $result->getColor());
        $this->assertNull($result->getTagGroup());
    }

    public function testCreatesTagWithGroup(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(TagGroupRepository::class);

        $group = new TagGroup();
        $group->setName('Category');
        $repo->method('find')->with(1)->willReturn($group);

        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        $handler = new CreateTagHandler($em, $repo);
        $result = $handler(new CreateTagCommand(name: 'Pump', tagGroupId: 1));

        $this->assertSame($group, $result->getTagGroup());
    }

    public function testCreatesTagWithNonExistentGroup(): void {
        $em = $this->createMock(EntityManagerInterface::class);
        $repo = $this->createMock(TagGroupRepository::class);

        $repo->method('find')->willReturn(null);

        $em->expects($this->once())->method('persist');
        $em->expects($this->once())->method('flush');

        $handler = new CreateTagHandler($em, $repo);
        $result = $handler(new CreateTagCommand(name: 'Pump', tagGroupId: 999));

        $this->assertNull($result->getTagGroup());
    }
}
