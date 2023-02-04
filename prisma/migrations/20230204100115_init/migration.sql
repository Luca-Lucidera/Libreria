-- CreateTable
CREATE TABLE `Libreria` (
    `idLibro` VARCHAR(191) NOT NULL,
    `idUtente` INTEGER NOT NULL,

    PRIMARY KEY (`idLibro`, `idUtente`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Libro` (
    `titolo` VARCHAR(191) NOT NULL,
    `numero` INTEGER NULL,
    `tipo` VARCHAR(191) NOT NULL,
    `casa_editrice` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `volumi_letti` INTEGER NOT NULL,
    `prezzo` DOUBLE NOT NULL,
    `colore` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`titolo`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserLogin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(191) NOT NULL,
    `lastLogin` DATETIME(3) NOT NULL,
    `userId` INTEGER NOT NULL,
    `expiresDate` DATETIME(3) NOT NULL,

    UNIQUE INDEX `UserLogin_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nome` VARCHAR(255) NOT NULL,
    `cognome` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Libreria` ADD CONSTRAINT `Libreria_idLibro_fkey` FOREIGN KEY (`idLibro`) REFERENCES `Libro`(`titolo`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Libreria` ADD CONSTRAINT `Libreria_idUtente_fkey` FOREIGN KEY (`idUtente`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserLogin` ADD CONSTRAINT `UserLogin_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
