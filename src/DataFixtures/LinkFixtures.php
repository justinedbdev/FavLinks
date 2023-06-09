<?php

namespace App\DataFixtures;

use App\Entity\Link;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use Faker;

class LinkFixtures extends Fixture implements DependentFixtureInterface
{
    public function load(ObjectManager $manager): void
    {
        $faker = Faker\Factory::create('fr_FR');

        for ($lk = 1; $lk <= 36; $lk++) {
            $link = new Link();
            $link->setTitle($faker->sentence());
            $link->setDescription($faker->text());
            $link->setLink($faker->url());

            $user = $this->getReference('user-' . rand(1, 5));
            $link->setUser($user);

            $manager->persist($link);
        }
        $manager->flush();
    }

    public function getDependencies(): array
    {
        return [
            UserFixtures::class
        ];
    }
}
