<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    private $counter = 1;

    public function load(ObjectManager $manager): void
    {

        $this->createUser('Debard', 'Justine', 'justine@test.com', $manager);
        $this->createUser('Martin', 'Laure', 'laure@test.com', $manager);
        $this->createUser('Petit', 'Arthur', 'arthur@test.com', $manager);
        $this->createUser('Dubois', 'Nathan', 'nathan@test.com', $manager);
        $this->createUser('Blanc', 'Estelle', 'estelle@test.com', $manager);

        $manager->flush();
    }

    public function createUser(string $surname, string $forename, string $email, ObjectManager $manager)
    {
        $user = new User();
        $user->setSurname($surname);
        $user->setForename($forename);
        $user->setEmail($email);
        $manager->persist($user);

        $this->addReference('user-' . $this->counter, $user);
        $this->counter++;

        return $user;
    }
}
