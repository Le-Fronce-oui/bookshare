import { PrismaClient } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

const books = [
    {
        "id":   uuidv4(),
        "name": "A Winter's Promise",
        "desc": "Long ago, following a cataclysm called the Rupture, the world was shattered into many floating celestial islands, known now as arks. Ophelia lives on Anima, where inhabitants can read the pasts of objects. What’s more, she is also a “mirror-traveler,” possessing an ability that has been passed down to her through generations. Her idyllic existence on Anima is disrupted when she is promised in marriage to Thorn, an influential member of a distant clan. Still only a girl, Ophelia must leave her family and follow her fiancé to Citaceleste, the capital of a cold and icy ark called Pole. But there, her future husband seems indifferent to her and she slowly realizes that her presence on Pole is part of a much bigger plot and has far-reaching ramifications not only for her but for her entire world.",
        "type": "BOOK",
        "iban": "9781609454838",
        "author": "Christèle Dabos",
        "cover": "mirror.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Philosopher's Stone",
        "desc": "Harry Potter has never even heard of Hogwarts when the letters start dropping on the doormat at number four, Privet Drive. Addressed in green ink on yellowish parchment with a purple seal, they are swiftly confiscated by his grisly aunt and uncle. Then, on Harry's eleventh birthday, a great beetle-eyed giant of a man called Rubeus Hagrid bursts in with some astonishing news: Harry Potter is a wizard, and he has a place at Hogwarts School of Witchcraft and Wizardry. An incredible adventure is about to begin!",
        "type": "BOOK",
        "iban": null,
        "author": "J.K. Rowling",
        "cover": "harry-potter-1.webp"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Chamber of Secrets",
        "desc": "Harry Potter's summer has included the worst birthday ever, doomy warnings from a house-elf called Dobby, and rescue from the Dursleys by his friend Ron Weasley in a magical flying car! Back at Hogwarts School of Witchcraft and Wizardry for his second year, Harry hears strange whispers echo through empty corridors - and then the attacks start. Students are found as though turned to stone ... Dobby's sinister predictions seem to be coming true.",
        "type": "BOOK",
        "iban": null,
        "author": "J.K. Rowling",
        "cover": "harry-potter-2.webp"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Prisoner of Azkaban",
        "desc": "When the Knight Bus crashes through the darkness and screeches to a halt in front of him, it's the start of another far from ordinary year at Hogwarts for Harry Potter. Sirius Black, escaped mass-murderer and follower of Lord Voldemort, is on the run - and they say he is coming after Harry. In his first ever Divination class, Professor Trelawney sees an omen of death in Harry's tea leaves ... But perhaps most terrifying of all are the Dementors patrolling the school grounds, with their soul-sucking kiss ...",
        "type": "BOOK",
        "iban": null,
        "author": "J.K. Rowling",
        "cover": "harry-potter-3.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Goblet of Fire",
        "desc": "The Triwizard Tournament is to be held at Hogwarts. Only wizards who are over seventeen are allowed to enter - but that doesn't stop Harry dreaming that he will win the competition. Then at Hallowe'en, when the Goblet of Fire makes its selection, Harry is amazed to find his name is one of those that the magical cup picks out. He will face death-defying tasks, dragons and Dark wizards, but with the help of his best friends, Ron and Hermione, he might just make it through - alive!",
        "type": "BOOK",
        "iban": null,
        "author": "J.K. Rowling",
        "cover": "harry-potter-4.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Order of the Phoenix",
        "desc": "Harry Potter is about to start his fifth year at Hogwarts School of Witchcraft and Wizardry. Unlike most schoolboys, Harry never enjoys his summer holidays, but this summer is even worse than usual. The Dursleys, of course, are making his life a misery, but even his best friends, Ron and Hermione, seem to be neglecting him. Harry has had enough. He is beginning to think he must do something, anything, to change his situation, when the summer holidays come to an end in a very dramatic fashion. What Harry is about to discover in his new year at Hogwarts will turn his world upside down...",
        "type": "BOOK",
        "iban": null,
        "author": "J.K. Rowling",
        "cover": "harry-potter-5.webp"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Half-Blood Prince",
        "desc": "When Dumbledore arrives at Privet Drive one summer night to collect Harry Potter, his wand hand is blackened and shrivelled, but he does not reveal why. Secrets and suspicion are spreading through the wizarding world, and Hogwarts itself is not safe. Harry is convinced that Malfoy bears the Dark Mark: there is a Death Eater amongst them. Harry will need powerful magic and true friends as he explores Voldemort's darkest secrets, and Dumbledore prepares him to face his destiny ...",
        "type": "BOOK",
        "iban": null,"author": "J.K. Rowling",
        "cover": "harry-potter-6.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "Harry Potter and the Deathly Hallows",
        "desc": "As he climbs into the sidecar of Hagrid's motorbike and takes to the skies, LEAVING Privet Drive for the last time, Harry Potter knows that LORD VOLDEMORT and the Death Eaters are not far behind. The protective CHARM that has kept Harry safe until now is BROKEN, but he cannot keep hiding. The Dark Lord is breathing FEAR into everything Harry LOVES, and to stop him Harry will have to find and destroy the remaining HORCRUXES. The final BATTLE must begin - Harry must stand and face his enemy...",
        "type": "BOOK",
        "iban": null,
        "author": "J.K. Rowling",
        "cover": "harry-potter-7.webp"
    },
    {
        "id":   uuidv4(),
        "name": "Horimiya T01",
        "desc": "On the surface, the thought of Kyouko Hori and Izumi Miyamura getting along would be the last thing in people's minds. After all, Hori has a perfect combination of beauty and brains, while Miyamura appears meek and distant to his fellow classmates. However, a fateful meeting between the two lays both of their hidden selves bare. Even though she is popular at school, Hori has little time to socialize with her friends due to housework. On the other hand, Miyamura lives under the noses of his peers, his body bearing secret tattoos and piercings that make him look like a gentle delinquent. Having opposite personalities yet sharing odd similarities, the two quickly become friends and often spend time together in Hori's home. As they both emerge from their shells, they share with each other a side of themselves concealed from the outside world.",
        "type": "MANGA",
        "iban": "978-0316342032",
        "author": "HERO",
        "cover": "horimiya.png"
    },
    {
        "id":   uuidv4(),
        "name": "Le Temps des Tempêtes",
        "desc": "À compter du 16 mai 2007, j'étais seul. Bien sûr, il y avait le peuple français, mais sa force collective ne s'exprime pas dans le quotidien des décisions à prendre, ou des nominations à effectuer. J'avais une équipe, des conseillers, des amis, des visiteurs du soir, mais j'étais seul à prendre et à assumer la décision finale. C'est le premier sentiment qui m'a envahi après avoir raccompagné Jacques Chirac à sa voiture et être remonté dans le bureau présidentiel qui était devenu le mien pour les cinq années à venir. Je l'avais voulu, espéré, rêvé. Maintenant j'y étais. Comment ne pas décevoir tous les Français qui venaient de me faire confiance ? Qu'est ce qui m'attendait ? J'ai fermé les yeux. Tout d'un coup, la gravité et, surtout, la solitude propre à la fonction me tombaient sur les épaules. C'était plus brutal que je ne l'avais imaginé. Soudain, mon passé avait disparu comme s'il n'avait jamais existé, seuls comptaient désormais le présent et l'avenir. C'était vertigineux, tellement fort que cela ne provoquait bizarrement aucune excitation intérieure. J'étais tout à la fois calme et parfaitement conscient d'être au bord d'un précipice.",
        "type": "BOOK",
        "iban": "9791032917169",
        "author": "Nicolas SARKOZY",
        "cover": "tempetes.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "Metamorphosis",
        "desc": "We don't talk about this book. It's for the best.",
        "type": "MANGA",
        "iban": null,
        "author": "Shindo L",
        "cover": null
    },
    {
        "id":   uuidv4(),
        "name": "Astérix et les 𝔊𝔬𝔱𝔥𝔰",
        "desc": "Comme tous les ans, Panoramix va disputer le concours de druides dans la forêt des Carnutes et il remporte la compétition grâce à sa potion magique. Mais des Goths se sont infiltrés en Gaule pour kidnapper le champion afin qu’il mette sa magie au service de leur chef Téléféric. Astérix et Obélix doivent donc partir en Germanie pour libérer leur druide.",
        "type": "BD",
        "iban": null,
        "author": "René GOSCINNY, Albert UDERZO",
        "cover": "astérix.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "Gaston 14. La saga des gaffes",
        "desc": null,
        "type": "BD",
        "iban": "2800109556",
        "author": "André FRANQUIN",
        "cover": "gaston.jpg"
    },
    {
        "id":   uuidv4(),
        "name": "86: Eighty-Six Vol.1",
        "desc": "The Republic of San Magnolia has long been under attack from the neighboring Giadian Empire's army of unmanned drones known as the Legion. After years of painstaking research, the Republic finally developed autonomous drones of their own, turning the one-sided struggle into a war without casualties-or at least, that's what the government claims.In truth, there is no such thing as a bloodless war. Beyond the fortified walls protecting the eighty-five Republic territories lies the \"nonexistent\" Eighty-Sixth Sector. The young men and women of this forsaken land are branded the Eighty-Six and, stripped of their humanity, pilot the \"unmanned\" weapons into battle...",
        "type": "LIGHT-NOVEL",
        "iban": "9781975303129",
        "author": "Asato Asato",
        "cover": "86.jpg"
    }
]

async function run() {

    for(let book of books) {
        await prisma.books.create({
            data: book
        });
    }
    
}

run()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    }
    )
