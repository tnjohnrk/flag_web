import { getMediaUrl } from "@/lib/media";

const rawPastorsDetails = [
  {
    tag: "-09",
    layerNum: 17,
    short: "Joh",
    name: "Pr. Johnson & Pr. Christina",
    role: "Branch Pastor – Kilambakkam",
    description: "They are ministering in Kilambakkam near Sevvapet.",
    image: "/images/pastors/pastor-01_-09_Joh.png"
  },
  {
    tag: "-08",
    layerNum: 16,
    short: "Ema",
    name: "Pr. Emmanuel Yovan",
    role: "Assisting Pastor – Home Church",
    description: "He is assisting in our Home Church",
    image: "/images/pastors/pastor-02_-08_Ema.png"
  },
  {
    tag: "-07",
    layerNum: 15,
    short: "Pra",
    name: "Pr. Praveen",
    role: "Lead Pastor – Patna, Bihar",
    description: "He is ministering in Patna, Bihar with his wife and Children. He's the lead Pastor of 2 branches",
    image: "/images/pastors/pastor-03_-07_Pra.png"
  },
  {
    tag: "-06",
    layerNum: 14,
    short: "Chir",
    name: "Pr. Chiranjeevi & Sunitha",
    role: "House Church Pastor – Avadi",
    description: "They are ministering in Avadi.",
    image: "/images/pastors/pastor-04_-06_Chir.png"
  },
  {
    tag: "-05",
    layerNum: 13,
    short: "Thom",
    name: "Pr. Thomai Rajan & Meksha",
    role: "Branch Pastor – Malayambakkam",
    description: "They are ministering in Malayambakkam near Mangadu.",
    image: "/images/pastors/pastor-05_-05_Thom.png"
  },
  {
    tag: "-04",
    layerNum: 12,
    short: "Sol",
    name: "Pr. Solomon Raj & Clara",
    role: "Branch Pastor – Nemilicheri",
    description: "They are ministering in Nemilicheri.",
    image: "/images/pastors/pastor-06_-04_Pet.png"
  },
  {
    tag: "-03",
    layerNum: 11,
    short: "Roy",
    name: "Pr. Royes & Deboral",
    role: "Branch Pastor – Kallikuppam",
    description: "They are ministering in Kallikuppam near Ambattur",
    image: "/images/pastors/pastor-07_-03_Roy.png"
  },
  {
    tag: "-02",
    layerNum: 10,
    short: "mani",
    name: "Pr. Manivannan & Rachel",
    role: "Branch Pastor – Morai",
    description: "They are ministering in Morai.",
    image: "/images/pastors/pastor-08_-02_mani.png"
  },
  {
    tag: "-01",
    layerNum: 9,
    short: "Jer",
    name: "Pr. Jerry & Vimisha",
    role: "Associate Pastor – FLAG",
    description: "He is the Son of Pr. Johnson and Associate Pastor of FLAG, leading the family and Media Department, serving along with his wife Vimisha.",
    image: "/images/pastors/pastor-09_-01_Jer.png"
  },
  {
    tag: "01",
    layerNum: 0,
    short: "Dad",
    name: "Pr. Johnson & Pr. Jemimah",
    role: "Senior Pastor & Founder",
    description: "He is the Senior Pastor and Founder of Full Life Centre AG. Serving along with his wife Pr. Jemimah",
    image: "/images/pastors/pastor-10_01_Dad.png"
  },
  {
    tag: "02",
    layerNum: 1,
    short: "Jeru",
    name: "Pr. Jedipheth Hagee & Jerusha Pearlin",
    role: "Pastor & Professor – SABC, Bangalore",
    description: "He is serving in Bangalore as a Pastor and a Professor in SABC, along with his wife Jerusha Pearlin who is the daughter of Pr. Johnson",
    image: "/images/pastors/pastor-11_02_Jeru.png"
  },
  {
    tag: "03",
    layerNum: 2,
    short: "Bal",
    name: "Pr. Balaji & Rebecca",
    role: "Branch Pastor – Alamathi",
    description: "He is ministering in Alamathi.",
    image: "/images/pastors/pastor-12_03_Bal.png"
  },
  {
    tag: "04",
    layerNum: 3,
    short: "Dan",
    name: "Pr. Daniel & Shanthi",
    role: "Evangelist – FLAG",
    description: "They are serving as Evangelists under FLAG, establishing House Churches.",
    image: "/images/pastors/pastor-13_04_Dan.png"
  },
  {
    tag: "05",
    layerNum: 4,
    short: "Nag",
    name: "Pr. Nagaraj & Rasathi",
    role: "House Church Pastor – Kannapalayam",
    description: "They are ministering in Mettupalayam near Kannapalayam.",
    image: "/images/pastors/pastor-14_05_Nag.png"
  },
  {
    tag: "06",
    layerNum: 5,
    short: "Jos",
    name: "Pr. Joshua & Shalomi",
    role: "Branch Pastor – Ayyapanthangal",
    description: "They are ministering in Ayyapanthangal",
    image: "/images/pastors/pastor-15_06_Jos.png"
  },
  {
    tag: "07",
    layerNum: 6,
    short: "Sun",
    name: "Pr. Sundar & Brindha",
    role: "Branch Pastor – Thiruthani",
    description: "Sis.Brindha is ministering in Thiruthani and Pr. Sundar went to be with the Lord.",
    image: "/images/pastors/pastor-16_07_Sun.png"
  },
  {
    tag: "08",
    layerNum: 7,
    short: "Vic",
    name: "Pr. Vicky & Nessammal",
    role: "Branch Pastor – Nattapettai",
    description: "They are ministering in Nattapettai near Kanchipuram.",
    image: "/images/pastors/pastor-17_08_Vic.png"
  },
  {
    tag: "09",
    layerNum: 8,
    short: "Jen",
    name: "Sis. Jency",
    role: "Ministry Assistant – Home Church",
    description: "She is assisting in our Home Church",
    image: "/images/pastors/pastor-18_09_Jen.png"
  },
  {
    tag: "10",
    layerNum: 18,
    short: "Mac",
    name: "Sis. Machtalin",
    role: "Ministry Assistant – Home Church",
    description: "She is assisting in our Home Church",
    image: "/images/pastors/pastor-19_10_Mac.png"
  }
];

const mobileImagesByTag = {
  "-09": "/images/paster/joshnson and christina.png",
  "-08": "/images/paster/imman.png",
  "-07": "/images/paster/praveen.png",
  "-06": "/images/paster/seranjivi.png",
  "-05": "/images/paster/thomai.png",
  "-04": "/images/paster/salamon.png",
  "-03": "/images/paster/royes.png",
  "-02": "/images/paster/manivannan.png",
  "-01": "/images/paster/jerry.png",
  "03": "/images/paster/balaji.png",
  "04": "/images/paster/daniel.png",
  "05": "/images/paster/nagaraj.png",
  "06": "/images/paster/joshwa.png",
  "07": "/images/paster/sundar.png",
  "08": "/images/paster/vicky.png",
};

const pastorsDetails = rawPastorsDetails.map((pastor) => ({
  ...pastor,
  image: getMediaUrl(pastor.image),
  mobileImage: mobileImagesByTag[pastor.tag]
    ? getMediaUrl(mobileImagesByTag[pastor.tag])
    : getMediaUrl(pastor.image),
}));

export default pastorsDetails;
