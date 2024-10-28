const { PrismaClient } = require( "@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                {name: 'Computer Science'},
                {name: 'Fitness'},
                {name: 'Music'},
                {name: 'Photography'},
                {name: 'Accounting'},
                {name: 'Engineering'},
                {name: 'Filming'},
            ]
        });
        console.log('Success')
    } catch (error) {
        console.log('Error seeding the categories database', error);
        
    } finally{
        await db.$disconnect();
    }
}

main();