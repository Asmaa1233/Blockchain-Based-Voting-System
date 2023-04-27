import { MigrationInterface, QueryRunner } from "typeorm";

export class initial1645167790939 implements MigrationInterface {
  name = "initial1645167790939";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`user\` (
          \`index\` int NOT NULL AUTO_INCREMENT,
          \`name\` varchar(100) NOT NULL,
          \`id\` varchar(8) NOT NULL,
          \`role\` varchar(100) NOT NULL,
          \`email\` varchar(100) NOT NULL,
          \`password\` varchar(255) NOT NULL,
          UNIQUE INDEX \`IDX_5cccbf6f2ad61b287544ddf45d\` (\`id\`),
          UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`),
          PRIMARY KEY (\`index\`)
      ) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_5cccbf6f2ad61b287544ddf45d\` ON \`user\``
    );
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}

