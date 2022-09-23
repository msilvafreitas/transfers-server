import express, { response } from 'express'
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

const app = express() 

app.use(express.json())
app.use(cors())

const prisma = new PrismaClient()

app.get('/positions', async (request, response) => {
    const positions = await prisma.position.findMany({
        include: {
            _count: {
                select: {
                    players: true,
                }
            }
        }
    })

    return response.json(positions);
});

app.post('/positions/:id/players', async (request, response) => {
    const positionId = request.params.id;
    const body: any = request.body;

    const player = await prisma.player.create({
        data: {
            positionId,
            name: body.name,
            age: body.age,
            discord: body.discord,
            current: body.current,
            potential: body.potential,
            accdev: body.accdev,
            delaydec: body.delaydec,
        }
    })

    return response.json(player);
});


app.get('/positions/:id/players', async (request, response) => {
    const positionId = request.params.id;

    const players = await prisma.player.findMany({
        select: {
            id: true,
            name: true,
            age: true,
            current: true,
            potential: true,
            accdev: true,
            delaydec: true,
            discord: true,
        },
        where: {
            positionId,
        },
        orderBy: {
            createdAt: 'desc',
        }
    })

    return response.json(players)
})

app.get('/players/:id/discord', async (request, response) => {
    const playerId = request.params.id;

    const player = await prisma.player.findUniqueOrThrow({
        select: {
            discord: true,
        },
        where: {
            id: playerId,

        }
    })

    return response.json ({
        discord: player.discord,
    })
})

app.listen(3333)

// Heroku? See how deploy prisma