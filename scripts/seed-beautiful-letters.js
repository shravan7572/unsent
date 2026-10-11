const { PrismaClient } = require('../app/generated/prisma');
const prisma = new PrismaClient();

const beautifulLetters = [
  
  {
    to: "The boy in the green sweater (December 2019)",
    username: "A stranger on the Yellow Line",
    feltThis: 36,
    content: "We shared earphones between Rajiv Chowk and Hauz Khas because one of mine died and you were listening to Prateek Kuhad. We never exchanged names or numbers.\n\nWe only traded small smiles when the metro lurched violently at Mandi House. Sometimes on rainy evenings when the train doors slide open, I still look up half-hoping you'll walk in carrying that same beat-up backpack.",
    comments: [
      {
        username: "Delhi commuter",
        content: "The Yellow Line holds more unsaid love stories than the entire city."
      }
    ]
  },
  {
    to: "Maa",
    username: "Your quietest child",
    feltThis: 74,
    content: "You asked me on the phone yesterday if I was eating well, and I said yes before quickly changing the subject.\n\nThe truth is, nothing in this foreign city tastes like the ginger tea you used to set on my desk during late-night exams without saying a word. I’m sorry I never learned how to tell you that I'm terrified of growing up.",
    comments: [
      {
        username: "Far from home",
        content: "Call her tonight. Please call her."
      },
      {
        username: "R.",
        content: "The silence of mothers is the loudest, purest love in existence."
      }
    ]
  },
  {
    to: "My First Love",
    username: "A ghost in your past",
    feltThis: 89,
    content: "I saw your wedding invitation on mutual friends' stories last week. You looked radiant in vermilion—just as gentle as the day we sat on the Marine Drive promenade at 2 AM, talking about stars we couldn’t see through the smog.\n\nI didn't send a congratulatory text because I didn't want my name to cast even a whisper of a shadow across your happiness. May you be cherished the way you always deserved.",
    comments: [
      {
        username: "Mumbai nights",
        content: "Loving someone enough to let them go without disturbing their peace."
      }
    ]
  },
  {
    to: "Nobody",
    username: "Midnight Walker",
    feltThis: 52,
    content: "There is a peculiar kind of grief in outgrowing the people who once held all your secrets.\n\nWe didn’t have a fight. No betrayal, no cruel words. Just the slow, polite cooling of two best friends becoming strangers over six-month intervals of 'we really need to catch up soon!'.",
    comments: [
      {
        username: "Anonymous",
        content: "The quiet fade of friendships hurts deeper than any breakup."
      }
    ]
  },
  {
    to: "Kabir",
    username: "The girl with ink on her fingers",
    feltThis: 63,
    content: "तुम्हें याद है वो पुरानी डायरी जिसमें तुमने पहली बार एक अधूरा शेर लिखा था?\n\nमैंने वो पन्ना आज भी संभाल कर रखा है। वक्त आगे बढ़ गया, शहर बदल गए, मगर जब भी पुरानी किताबों की खुशबू आती है, मुझे लगता है तुम लाइब्रेरी की उसी पुरानी मेज़ पर सामने बैठे मुस्कुरा रहे हो।",
    comments: [
      {
        username: "पुरानी यादें",
        content: "कुछ पन्ने कभी पुराने नहीं होते..."
      }
    ]
  },
  {
    to: "My 18-Year-Old Self",
    username: "Ten years later",
    feltThis: 95,
    content: "Stop apologizing for taking up space in rooms you worked so hard to enter.\n\nThat entrance exam you cried over on the bathroom floor won't even matter in five years. And the person who didn't text you back was merely making room for who you actually needed to become. Breathe. You survive everything you thought would end you.",
    comments: [
      {
        username: "Twenty-something",
        content: "I really, really needed to read this tonight."
      }
    ]
  },
  {
    to: "S.",
    username: "A quiet heart",
    feltThis: 41,
    content: "I don't think you ever noticed that when you laughed genuinely, your left eye would crinkle in that tiny specific way.\n\nIn crowded rooms, I only ever listened for your voice. I never told you because what we had as friends was too precious to risk losing. In the end, we drifted anyway. If I could turn back time, I would have taken the risk.",
    comments: [
      {
        username: "Unsaid regrets",
        content: "The courage we find five years too late."
      }
    ]
  },
  {
    to: "The Passenger on Seat 34B",
    username: "Seat 34A",
    feltThis: 58,
    content: "Flight 6E 302 to Bengaluru, August 14. We were stuck on the tarmac for three hours. You lent me your extra jacket when the cabin was freezing and told me stories about your grandmother's jasmine garden in Mysore.\n\nWe talked like we had known each other in seven different lifetimes. When the plane finally docked, luggage carousels pulled us apart before I could ask for your name. If you ever read this: thank you for making the delay feel like the best part of the journey.",
    comments: [
      {
        username: "Airport wanderer",
        content: "Temporary strangers are sometimes the most permanent memories."
      }
    ]
  },
  {
    to: "Nobody",
    username: "अनकहा मुसाफ़िर",
    feltThis: 67,
    content: "रात के तीन बजे जब पूरा शहर सोता है, तब कुछ नाम अनायास ही ज़ुबान पर आ जाते हैं।\n\nन कोई शिकवा, न कोई उम्मीद। बस एक खामोश दुआ कि तुम जहां भी हो, महफ़ूज़ रहो और ज़िंदगी तुम्हें वो सारी खुशियां दे जो मैं कभी दे नहीं सका।",
    comments: [
      {
        username: "रात का मुसाफ़िर",
        content: "खामोश दुआएं सबसे पाक होती हैं।"
      }
    ]
  }
];

async function seed() {
  console.log("Cleaning old test letters...");
  // Delete comments first due to foreign keys
  await prisma.comment.deleteMany({});
  await prisma.letter.deleteMany({});
  console.log("Old records deleted cleanly.");

  console.log("Seeding authentic unsent letters...");
  for (const item of beautifulLetters) {
    const { comments, ...letterData } = item;
    const created = await prisma.letter.create({
      data: {
        ...letterData,
        comments: {
          create: comments || []
        }
      }
    });
    console.log(`Created letter: To "${created.to}" from "${created.username}"`);
  }

  const count = await prisma.letter.count();
  console.log(`Successfully seeded ${count} letters.`);
}

seed()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
