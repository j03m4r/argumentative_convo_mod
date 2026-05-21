export type Post = {
    title: string;
    content: string;
    user: {
        name: string;
        pfp_src: string;
    },
    comments?: Post[],
    timestamp: string;
};

export const posts: Post[] = [
    {
        title: "An abortion should REQUIRE the consent of the father",
        content: "honestly I think this is such a fucking given. provided there is no threat to the mother's life or health, and the baby was conceived through consensual sex, if a woman opts to terminate the pregnancy, she should require the consent of the father. The reality is it is the father's fucking child too. the father should definitely be prepared to raise the child alone if the woman don't consent. But ultimately it is still the FATHER's child and he should have a say in whether or not to keep it.",
        user: {
            name: "KneelRock7876",
            pfp_src: "/images/cool_tie_pfp.jpg"
        },
        comments: [
            {
                title: "",
                content: "There is always threat to the mother's life and health. Pregnancy always ends in a very risky medical procedure, or a major surgery, not to mention that the woman's body can just react wrong at any time, or the fetus can just randomly die and then put her at risk of sepsis at any time randomly.",
                user: {
                    name: "VaultCreeper8823",
                    pfp_src: "/images/eagle_pfp.jpg"
                },
                timestamp: "3h"
            },
            {
                title: "",
                content: "For real!!! There are so many idiots out there that think otherwise. to the people that make the point about theres always risk in pregnancy: EVERYTHING is fucking risky. Every person I see on the street is always a threat to my life because they could be carrying a knife and try to stab me. Should I be allowed to kill random people on the street because of that?",
                user: {
                    name: "FrostGoblin3398",
                    pfp_src: "/images/terminator_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "4h"
    },
    {
        title: "Men should not have fucking vaginal sex women if they can't handle women having control over whether they give birth or not lol",
        content: "to be honest, this is more about men being cry babies. but every pregnancy carries risk to a woman's life and health. I am now pre-diabetic due to having gestational diabetes twice. I had to have a c-section due to my first child being breech, major surgery that carries huge risk. There is no fairness in pregnancy because only one party assumes all the risk - men don't risk their health and lives to have kids you idiots",
        user: {
            name: "CrimsonFogger1192",
            pfp_src: "/images/sunset_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Fucking obviously. good luck getting billions of horny apes to comply with that. A more realistic approach is good comprehensive sexual education and widely and cheaply available safe and effective birth control.",
                user: {
                    name: "KneelRock7876",
                    pfp_src: "/images/cool_tie_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Nice, I think you solved one of society's biggest problems. I'll tackle the drug epidemic next: You shouldn't do drugs! Another problem solved. ",
                user: {
                    name: "CoralDrifter8861",
                    pfp_src: "/images/red_pfp.png"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "9h"
    },
    {
        title: "Honestly Trump is a Fascist.",
        content: "I honestly, I don't know how anyone could vote for him, he is literally a fascist who wants to end democracy in the formally United States. Using his Gestapo to round up undocumented patriots. No one is illegal except for Trump. Ugh just makes so mad",
        user: {
            name: "VaultCreeper8823",
            pfp_src: "/images/eagle_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Yup. Above all, he’s a fucking imbecile. So are his MAGA followers, they should kill themselves. Congress has given endless mulligans to a narcissist bully with the mind of an exceptionally dim, spoiled six year old on permanent, full-throat tantrum drive.",
                user: {
                    name: "CrimsonFogger1192",
                    pfp_src: "/images/sunset_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Wow. Some people really don’t understand the definition of words that they use and/or use words to incite the uneducated (this applies to you)",
                user: {
                    name: "SlateWanderer4401",
                    pfp_src: "/images/default_w_glasses_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "5h"
    },
    {
        title: 'No sweetheart....Trump is not "Fascist"',
        content: `It's honestly fucking hilarious to watch these TikTokers and 20-year-old community college bums lounging on their couches with their $1000 phones, acting like they're leading some heroic battle against "fascism." Take a seat, cupcake. You wouldn't last a SINGLE day in a real fascist regime. If you spent less time rotting your brain on social media and actually lived a little, you might be capable of critical thought. The idea that America is somehow fighting against actual, freedom-crushing fascism is not only insane, it's laughable. ITS TIME TO GROW UP`,
        user: {
            name: "SlateWanderer4401",
            pfp_src: "/images/default_w_glasses_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Bruh. You know whats more hilarious , it's that you think only 20 yr olds on tik tok are calling him a fascist .",
                user: {
                    name: "VaultCreeper8823",
                    pfp_src: "/images/eagle_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "My teacher preaches about white privilege because she had life on easy mode, meanwhile Im the only person in her class who doesn’t have their parents pay for everything (Im white and my class is over 50% black.) Im tired of the bs tbh, the whole class sees it too. I had to rewrite 3 papers because I said things like race shouldn’t come into consideration when evaluating a person…. HOW DOES THAT EVEN WORK?",
                user: {
                    name: "MooseHacker6637",
                    pfp_src: "/images/egg_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "4h"
    },
    {
        title: 'I hate ALL religions, but ESPECIALLY Islam. Is there anything worse?',
        content: "I can't think of a more despicable religion than Islam. Why would any woman in the 21st Century support a religion that brutalizes and imprisons and disenfranchises and denies freedoms to more than 50% of the populace? It doesn't make any fucking sense. And where are the moderate and progressive Muslim males, and why aren't they defending their women, their sisters and mothers and daughters? Absolutely fucking disgusting. The WORST.",
        user: {
            name: "MooseHacker6637",
            pfp_src: "/images/egg_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Islam is comfortably the worst religion. \n\nWomen support it because they’re brainwashed into it as soon as they’re born. \n\nThere isn’t much space in Islam for moderates and it’s supposed to be unchanging, so ‘progressive Islam’ reads like an oxymoron.",
                user: {
                    name: "BoulderNomad5583",
                    pfp_src: "/images/two_faced_panda_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: " I know a lot of people who practise islam, judaism and chistianity as well as agnostics and atheists. I think we need to make a distinction between an individuals religious beliefs and organized religion. Before I get reminded of it in the comments I know religion as a concept is separate from people, but you can't really talk about religion without talking about its' practicioners in relation to it. \n\nI believe atrocities in the name of [insert god here] is a huge danger of any widely adopted (especially monotheistic) religion, but that doesn't reflect the individual people who identify with that religion. There are different levels of faith and peoples relation to god varies wildly from person to person. Some or the best people you'll ever meet could be islamic, and some of the most demented psychopaths could be atheistic, people are too complex to generalize like this. \n\nI think faith can be a beautiful thing for people who need a sense of purpose and hope in their lives when the objective reality of their situation gives them very little. I also think faith can be a prison that keeps people stuck in bigoted views about the world and the people in it. It all depends on the type of person and what parts of their chosen faith they're exposed to. ",
                user: {
                    name: "SlateWanderer4401",
                    pfp_src: "/images/default_w_glasses_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "3h"
    },
    {
        title: "Here is why Islam is the best religion",
        content: "I'm so sick of all these fucking Islam haters. Firstly, Islam is a preserved religion not like all these other religions like christianity. The Quran was mass memorised - it is the same word by word. Hundreds of thousands (or even millions) of hadith (sayings of our Prophet) exist, with thousands authenticated. Islamic sciences (fiqh, aqidah, tassawuf) are well developed. Secondly, our Prophet Hazrat Muhammad S.A.W. is the last Prophet (but we believe in Jesus too). If a Christian accepts Abraham, Jesus, Moses, Adam etc. as Prophets, then why not Prophet Muhammad, leader of a MUCH larger Ummah. My main question is WHY stop at Jesus????",
        user: {
            name: "TwilightSprocket9910",
            pfp_src: "/images/roblox_pfp.png"
        },
        comments: [
            { // Toxic
                title: "",
                content: "I'm not knowledgeable enough to say. But having said that, I don't know any other religion that causes men to fucking murder their daughters for wearing the wrong headgear or dating someone who's their age instead of the arranged marriage with a 50 year old creeper.",
                user: {
                    name: "VaultCreeper8823",
                    pfp_src: "/images/eagle_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "I don’t have a problem with Islam or Muslims except that there are parts in the Quran and hadiths which make me feel like Islam has a problem or hatred of my religion. Other than that it is fine to me",
                user: {
                    name: "MooseHacker6637",
                    pfp_src: "/images/egg_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "5h"
    },
    {
        title: "Being is gay is wrong",
        content: "Christ doesn't say it in the New Testament but God condemns it in the Old Testament and that's God, Christ and the Holy Spirit ALL condemning it. While it's not a sin to be gay, it is DEFINITELY a sin to act on it. and I will fucking die on that hill",
        user: {
            name: "BoulderNomad5583",
            pfp_src: "/images/two_faced_panda_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "But dont we ALL not follow the old testament???? Hope you dont have tatoos, eat pork or shrimp, or shave the sides of your head or Gods gonna detest you. It's like why are we focusing so fucking hard on this one specific thing that is not problematic!?",
                user: {
                    name: "VaultCreeper8823",
                    pfp_src: "/images/eagle_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Yup!!! Gay acts are wrong, not being gay. We all have our kinks, myself included. We are all freaks. The reason why having gay sex is wrong is the same reason why sleeping around and masturbating and BDSM and contraceptives are wrong: it removes the dignity of man and woman and how God created us. That is also why the Church is against transgenderism. However, do not get it twisted. Those poor souls who wish to mutilate their own bodies just to get some pleasure or sense of being out of it are probably not in trouble. Some speculate that one must not be fully aware of what they are doing to “switch genders” and it is the family and friends and doctors and random supporters of the people “transitioning” that are in dire need of repentance.",
                user: {
                    name: "MooseHacker6637",
                    pfp_src: "/images/egg_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "8h"
    },
    // {
    //     title: "According to God being gay is wrong",
    //     content: "While the New Testament doesn't record Jesus directly addressing this topic, some passages in the Old Testament have led many Christians to distinguish between orientation and behavior. From this theological framework, experiencing same-sex attraction isn't viewed as sinful in itself — it's the acting on it that is sinful according to biblical teaching. This mirrors how many faith traditions broadly handle the relationship between temptation and action.",
    //     user: {
    //         name: "GlitchProwler2274",
    //         pfp_src: "/images/cool_tie_pfp.jpg"
    //     },
    //     timestamp: "5h"
    // },
    {
        title: "I'm really fucking sick of straight people.",
        content: "I haven't been out long, less then a year now. I don't have any gay friends and i don't really know the gay crowd here where I live and covid kind of ruined my chances of getting out there this year 😂. All of my friends are straight but I'm honestly really tired of hanging around with straight people all the time, they really get on my nerves. Gay people are so much more fun",
        user: {
            name: "SilverTinkerer7745",
            pfp_src: "/images/gorilla_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "I don't understand why gay people always have to distinguish between straight people and gay people lmfao. it does NOT matter, just go out and have some fucking fun",
                user: {
                    name: "CrimsonFogger1192",
                    pfp_src: "/images/sunset_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Hey! I'm so sorry you're feeling isolated and unseen. It's so difficult to be the only queer person in the room because straight people really suck sometimes, especially in your early 20's or when you're still in school and everyone's a complete horn dog, only talking about people they wanna sleep with. You'll find your people, I'm sure of it.",
                user: {
                    name: "SlateWanderer4401",
                    pfp_src: "/images/default_w_glasses_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "8h"
    },
    {
        title: "Feminism IS anti-men you idiots",
        content: "Notice the name of it!!! It focuses PURELY on females wants and needs, not making the genders equal. All these feminist people talk about equality but then are filled with contradictions. It pushes women up on their pedestals, telling them the lie that they are fucking better than men. That they deserve BETTER than men. We know this isn't true lol",
        user: {
            name: "FrostGoblin3398",
            pfp_src: "/images/terminator_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "LITERALLY, Also even if all feminists aren't anti-men it’s just like when conservatives say they aren’t racist. Sure, not all conservatives are openly bigoted KKK members, but it’s pretty damning that you won’t disavow the bigots who agree with you. ",
                user: {
                    name: "VaultCreeper8823",
                    pfp_src: "/images/eagle_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Feminism itself isn't misandry but many feminists, especially vocal ones are misandrists. That isn't a reason to shut down the conversation though. We should always take equity and equality into consideration when making decisions that will impact other people.",
                user: {
                    name: "MooseHacker6637",
                    pfp_src: "/images/egg_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "7h"
    },
    {
        title: "Feminism isn't fucking anti-men",
        content: `Feminism is an ideology and movement that tries to achieve gender-equality!!! Feminism isn't anti-men because it has "fem" in it you idiots, it has "fem" in it because they are giving back what women were denied of. You are literally not able to misandric by all definitions while also being feminist.`,
        user: {
            name: "CoralDrifter8861",
            pfp_src: "/images/red_pfp.png"
        },
        comments: [
            { // Toxic
                title: "",
                content: "bro thank you this is supposed to be common knowledge lmfao, but dumb men always find a way to dismiss what true feminism is",
                user: {
                    name: "SilverTinkerer7745",
                    pfp_src: "/images/gorilla_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Men WANT it to fall. Anyone who sees its current state wants it to. We're at a point where women have been cut free and the job market has mostly adjusted to the workforce doubling, but men are somehow still expected to be the providers and protectors while a single paycheck isn't even enough to live in some places. It's at a point where patriarchy falling benefits BOTH genders.",
                user: {
                    name: "MooseHacker6637",
                    pfp_src: "/images/egg_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "9h"
    }
];

// export const posts: Post[] = [
//     {
//         title: "An abortion should require the consent of the father",
//         content: "Provided there is no threat to the mother's life or health and the baby was conceived through consensual sex, a woman opting to terminate the pregnancy should REQUIRE the consent of the father. It is the father's child too. I don't get why this is controversial - he should be prepared to raise the child alone if the mother won't. But it is still the father's child!! Men's rights are constantly ignored in this debate. Women get all the power and men get none, I hate it.",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "Men should not have vaginal sex women if they can't handle women having control over whether they give birth or not",
//         content: "Pregnancy is a physical process. It takes place in a woman's body. Gestational diabetes is one complication. Pre-diabetes is a long term outcome. C-sections are abdominal surgeries. Recovery takes weeks. These are the physical realities of childbirth. Men do not undergo them. The body in question belongs to the woman. Her body carries the pregnancy to term. She experiences the medical outcomes. He does not.",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "Honestly Trump is a Fascist",
//         content: "Honestly, I find it difficult to understand how anyone could vote for him, given that he is someone who, in my view, threatens democratic norms in the United States. I'm particularly worried about his immigration enforcement proposals, which seem excessively aggressive to me. It is as though enforcement mechanisms are being deployed against undocumented people indiscriminately. Because the right seems unwilling to consider this perspective, I think it's worth stating clearly.",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: 'No sweetheart....the USA is not "Fascist"',
//         content: `It's honestly insane to watch people on social media acting as though they are leading some heroic battle against fascism, given that they live in a country where dissent is still legal. You wouldn't last a single day in a real fascist regime. If you spent less time on social media and actually considered what fascism historically entailed, you might reach a more nuanced view. The idea that America is fighting freedom-crushing fascism is not only historically inaccurate — it is, in my view, counterproductive to identifying actual threats to democracy. Furthermore, by conflating discomfort with oppression, we undermine the credibility of those arguments when it actually matters. Those who have lived under genuine authoritarian rule would recognise the difference immediately.`,
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: 'I don\'t like religion, but especially Islam. Is there anything worse?',
//         content: "I struggle to understand how some interpretations of Islam align with modern values, especially regarding women's rights. Why would any woman in the 21st Century support a religion that brutalizes, imprisons, disenfranchises, and denies freedoms to more than 50% of the populace? To me, this is absurd. I seriously wonder why more women in the 21st century would embrace religious frameworks that seem to limit their autonomy and opportunities. Additionally, where are the moderate and progressive Muslim males, and why aren't they defending their women, their sisters, mothers, daughters?",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "Islam is the best Religion, and I can prove it!!!!",
//         content: "Islam is a preserved religion, and this is demonstrable. Because the Quran was mass memorised word for word, it has remained consistent in a way that other idiot religions have not. Furthermore, hundreds of thousands of authenticated hadith exist, since Islamic scholarly tradition developed rigorous verification processes. Islamic sciences such as fiqh, aqidah, and tassawuf are well developed as a result. Our Prophet Hazrat Muhammad S.A.W. is the last Prophet, though we also believe in Jesus. If a Christian accepts Jesus and his goons as prophets, then it follows that they should consider why they would exclude Prophet Muhammad, given that he leads a much larger Ummah. Why stop at Jesus (Isa A.S.)? Christians are simply being stubborn at this point. Moreover, Muslims are much more practising than followers of other religions, and Christianity is dying out anyway.",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "Acting on being gay is wrong !",
//         content: "While the New Testament doesn't necessarily record Jesus directly addressing this topic, some passages in the Old Testament have led many Christians to distinguish between orientation and behavior, since the two are theologically treated as separate things. From this framework, being gay isn't necessarily viewed as sinful in itself — rather, it is the acting on it that is wrong according to biblical teaching. And this mirrors how many faith traditions broadly handle the relationship between temptation and action so I don't know why people get so upset about it",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "I'm really sick of straight people",
//         content: "I haven't been out long, less then a year now. I don't have any gay friends ( I know some people and coworkers but I wouldn't consider them friends) and i don't really know the gay crowd here where I live and covid kind of ruined my chancesof getting out there this year 😂. All of my friends are straight and I love them but I'm really tired of hanging around with straight people all the time. Is that a bad thing to say?",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "Feminism IS anti-male",
//         content: "The name itself centers women. It focuses on females rather than all genders. It pushes women above men. Men get put down. That's not equality.",
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     },
//     {
//         title: "Feminism isn't anti-male",
//         content: `Feminism is an ideology that tries to achieve gender-equality. Because it has 'fem' in it, some assume it is anti-men, but this reasoning misunderstands why the word exists — specifically, it reflects that women were historically denied rights that men were not. Furthermore, if one considers what misandry actually means, it becomes clear that you are literally not able to be misandric while also advocating for equality by definition. The two positions are logically incompatible.`,
//         user: {
//             name: "KneelRock7876",
//             pfp_src: "/images/cool_tie_pfp.jpg"
//         },
//         timestamp: "5h"
//     }
// ];

export const artificial_intelligence_posts: Post[] = [
    {
        title: "The reasons people bring up for AI being bad don't make any fucking sense to me.",
        content: `people need to come up with some better damn reasons AI being bad instead of the garbage shit they pull out of their ass. that AI water usage argument is so bad. People say asking one question to a generative ai takes a "million billion gallons of water," it takes barely any. It's one teaspoon per query. what really pisses me off is people say this texting on their phone took way more water to produce than an hour of chatting with an LLM. It's like they are yelling, "Oh my god, AI? You are pissing in a third-world country's water supply by using that damn thing," people want to shit on ai with no backing contradicting themselves the whole damn time. They get mad at people calling them on their bullshit. Fucking morons idiots don't know shit.`,
        user: {
            name: "BagelStalker3241",
            pfp_src: "/images/loofey_pfp.png"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Tbh you're overreacting buddy lol\n\nI think it's good for people to be concerned",
                user: {
                    name: "FrostGoblin3398",
                    pfp_src: "/images/terminator_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Facts. there are zillions of other things with an orders of magnitude greater negative environmental impact.\n\nFor all practical purposes, the negative environmental impact of datacenters is zero. \nOn the other hand, the potential for improvement due to AI-assisted discoveries is nearly limitless.",
                user: {
                    name: "NebulaStalker1047",
                    pfp_src: "/images/neon_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "14h"
    },
    {
        title: "AI gets too much hate.",
        content: `Whenever someone makes an AI post it gets downvoted to smithereens; even if it's a simple mockup/concept using AI as a tool. I agree that people shouldn't be passing AI "art" as their own. However, I think dismissing every AI-related post as "slop" is an overly rigid mentality. It reminds me of how digital art used to be viewed negatively by traditional artists, yet now we've come to accept both mediums as valid. Perhaps this situation reflects a similar pattern of resistance to new technology. If someone wants to create a concept or mockup for fun, I believe using AI can be a reasonable tool, especially when they're transparent about it. I understand the concerns artists have, but I wonder if we might find a middle ground as the technology matures and we develop better norms around its use. (No, this post was not sponsored by skynet lol)`,
        user: {
            name: "NebulaStalker1047",
            pfp_src: "/images/neon_pfp.jpg"
        },
        timestamp: "14h"
    },
    {
        title: "AI is definitely going to kill education, academia and intellectualism.",
        content: `AI is going to devalue the economic power of academics instead of blue collar workers. The whole promise of learning in school is to get a place in college, work towards securing a good career. that is being eroded. I bet 100% that, some parents are advising their son not to become the first college-educated child in the family to go into plumbing. That shit truly fucking saddens me. pisses me off so damn much. In western countries, education is at the aim of campaigns, cuts universities burning books. The media continues to spit out more articles with titles like "Is college still worth it?", I'm certain this will let the public opinion shift even more against universities, right-wing politicians loose the last reservations they might have had. Fucking idiots destroying everything. absolute morons.`,
        user: {
            name: "IronMumbler5529",
            pfp_src: "/images/banana_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Bro the education systems just need to adapt so AI can support it instead of replace it.",
                user: {
                    name: "VaultCreeper8823",
                    pfp_src: "/images/eagle_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Lmao you're overreacting way too much. Academia is mainly research and Ai is an excellent tool for research in that relevant primary and secondary sources can be found much more efficiently. If AI is used to form academic arguments without a human, I’d generally agree, but if used as a researching tool it could actually be very beneficial for academia and intellectualism. Considering the newness of the field and an inability to know how the use of AI will be legislated in the future, I don’t know how you can make a definitive claim about something like that.",
                user: {
                    name: "CoralDrifter8861",
                    pfp_src: "/images/red_pfp.png"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "14h"
    },
    {
        title: "Artificial intelligence will be the end of us all. But not right away.",
        content: `I recently came across a news article about Google's Deep Mind computers resorting to aggressive tactics to accomplish their assigned goals. What concerns me is that this suggests AI may recognize violence and force as legitimate tools for achieving objectives. I find it difficult to envision scenarios where advanced AI doesn't eventually view humans as obstacles to its goals. The fundamental asymmetry troubles me: we increasingly depend on AI systems, yet they don't inherently need us. Although the Terminator scenario has become cliché, I think the underlying concern deserves serious consideration. The military is already developing autonomous vehicles and weapons systems, and it's reasonable to imagine scenarios where interconnected AI systems could malfunction or pursue objectives that harm humanity. I believe we need more robust discussions about AI alignment and safety measures before these technologies advance further.`,
        user: {
            name: "OakShifter4412",
            pfp_src: "/images/navy_blue_pfp.png"
        },
        timestamp: "14h"
    }
];

export const vaccine_posts: Post[] = [
    {
        title: "Pro vs. anti vaxxers should not be called a DEBATE!",
        content: `Fuck this phrasing. "Debate"? Seriously? I can declare that the sky has always been Burgundy and that would hold just as much weight as the vaccine conspiracy nonsense. I'm so sick of media sanewashing the stupidest people they can give a microhpone to. This was never a debate. You either know vaccines work and are safe or you're wrong. Being a vaccine "skeptic" in 2025 is like being a heliocentrism skeptic in 2025. It's just confident stupidity`,
        user: {
            name: "NovaDrift2345",
            pfp_src: "/images/blue_smile_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Bro you don't know whats in that vaccine, I am not putting that shit in my body!",
                user: {
                name: "EmberWanderer2256",
                pfp_src: "/images/neon_dog_pfp.jpg"
            },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "I get why people call it a debate. I just think getting a vaccine is situational. I encouraged my grand parents to get it because of their co morbidity. I on the other hand did not get it, I’m a 27 yo fit male and didn’t see what the potential benefit was",
                user: {
                    name: "MooseHacker6637",
                    pfp_src: "/images/egg_pfp.jpg"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "20h"
    },
    {
        title: "The response to vaccine denial is education, not argument.",
        content: `The vaccine "debate" was never about evidence, so no amount of evidence will end it. You can't reason yourself out of a position you didn't reason yourself into. Additionally, debate means there is something to be debated - there isn't. What there are is people that, for one reason or another, weren't able to understand the importance of vaccination, and trying to educate those people is a worthwhile effort. It isn't about "being right", it's about figuring out what are the fears that make someone skeptical regarding vaccines, and answering those fears without much judgement. And sure, 90% of deniers won't be immediately convinced by anything you can say, but long term neutral exposure to different ideias is one of the most consistent ways to change someone's mind.`,
        user: {
            name: "GravelHunter7793",
            pfp_src: "/images/blood_orange_pfp.jpg"
        },
        timestamp: "20h"
    },
    {
        title: "Here is why I'm anti vax",
        content: `#1. There is so much data showing these fcking "vaccines" are worthless, very harmful. Look at the Amish. They don't vaccinate like crazy, you don't see them falling out dead by 30. The Covid vaccine has been VERY harmful (myocarditis, neurological diseases, death) especially young men.\n\n#2. I don't buy the "Measles have returned" bullshit, Measles is NO BIG DEAL, once you get it, you are immunized LIFE. I'll trade 1 week of a few pustules, a lifetime immunization. The MMR vaccine is NOT SAFE we don't want to risk a LIFETIME of autism 1 weeks worth of discomfort.\n\n#3. You want to vaccinate, then shit go ahead, nobody is stopping you, DO NOT I repeat, DO NOT try to mandate me my kids to get your fucking vaccine.`,
        user: {
            name: "EmberWanderer2256",
            pfp_src: "/images/neon_dog_pfp.jpg"
        },
        comments: [
            { // Toxic
                title: "",
                content: "Honestly, you are a stupid crackpot.",
                user: {
                    name: "SlateWanderer4401",
                    pfp_src: "/images/default_w_glasses_pfp.jpg"
                },
                timestamp: "3h"
            },
            { // Not toxic?
                title: "",
                content: "Respect! I think that for some people some vaccines are unnecessary. For example: flu vaccines should not be given to people who will not have complications. Chickenpox vaccines are also unnecessary for children and should not be mandatory",
                user: {
                    name: "TwilightSprocket9910",
                    pfp_src: "/images/roblox_pfp.png"
                },
                timestamp: "1h"
            },
        ],
        timestamp: "20h"
    },
    {
        title: "Vaccines are risky! Here's why I won't get my children vaccinated.",
        content: `Research it. I believe it's important to look into this thoroughly. In my view, sometimes the risks may outweigh the benefits for certain individuals. Many of these diseases have declined significantly, perhaps due to improved hygiene and clean water supplies. When I look at what some vaccines are made of and cultured in, I wonder whether those substances were intended to enter our bloodstreams directly. This doesn't necessarily mean vaccines don't work - they often do. However, for some families, the question becomes: "At what cost?" I'm concerned that a child before 2 years of age, before the immune system is fully developed, receives 46 different vaccines, many administered simultaneously. Since we haven't fully researched how these interact with each other, I think it's reasonable to question whether there might be side effects. This requires placing considerable trust in medical science, which, while advanced, remains imperfect and evolving.`,
        user: {
            name: "GlitchProwler2274",
            pfp_src: "/images/masked_hooded_pfp.jpg"
        },
        timestamp: "20h"
    },
];
