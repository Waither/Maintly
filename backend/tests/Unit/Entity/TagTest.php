<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Tag;
use App\Entity\TagGroup;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\Test;
use PHPUnit\Framework\TestCase;

#[CoversClass(Tag::class)]
class TagTest extends TestCase {
    #[Test]
    public function newTagHasNullId(): void {
        $tag = new Tag();

        $this->assertNull($tag->getId());
    }

    #[Test]
    public function canSetAndGetName(): void {
        $tag = new Tag();
        $tag->setName('Pilne');

        $this->assertSame('Pilne', $tag->getName());
    }

    #[Test]
    public function canSetAndGetColor(): void {
        $tag = new Tag();
        $tag->setColor('#FF0000');

        $this->assertSame('#FF0000', $tag->getColor());
    }

    #[Test]
    public function canSetAndGetTagGroup(): void {
        $tag = new Tag();
        $group = new TagGroup();
        $group->setName('Status');

        $tag->setTagGroup($group);

        $this->assertSame($group, $tag->getTagGroup());
    }

    #[Test]
    public function tagGroupCanBeNull(): void {
        $tag = new Tag();
        $tag->setTagGroup(null);

        $this->assertNull($tag->getTagGroup());
    }

    #[Test]
    public function setNameReturnsSelf(): void {
        $tag = new Tag();

        $result = $tag->setName('Test');

        $this->assertSame($tag, $result);
    }

    #[Test]
    public function setColorReturnsSelf(): void {
        $tag = new Tag();

        $result = $tag->setColor('#00FF00');

        $this->assertSame($tag, $result);
    }
}
