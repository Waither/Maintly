<?php

declare(strict_types=1);

namespace App\Tests\Unit\Entity;

use App\Entity\Tag;
use App\Entity\TagGroup;
use PHPUnit\Framework\TestCase;

class TagEntityTest extends TestCase {
    public function testTagGetterSetter(): void {
        $group = new TagGroup();
        $group->setName('Category');
        $group->setIsSingleChoice(true);

        $tag = new Tag();
        $tag->setName('Electrical');
        $tag->setColor('#00ff00');
        $tag->setTagGroup($group);

        $this->assertSame('Electrical', $tag->getName());
        $this->assertSame('#00ff00', $tag->getColor());
        $this->assertSame($group, $tag->getTagGroup());
    }

    public function testTagGroupGetterSetter(): void {
        $group = new TagGroup();
        $group->setName('Type');
        $group->setIsRequired(true);
        $group->setDisplayOrder(1);

        $this->assertSame('Type', $group->getName());
        $this->assertTrue($group->isRequired());
        $this->assertSame(1, $group->getDisplayOrder());
    }

    public function testTagGroupTagsCollectionEmpty(): void {
        $group = new TagGroup();
        $this->assertCount(0, $group->getTags());
    }
}
