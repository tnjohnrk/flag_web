const pastorsDetails = [
  {
    tag: "-09",
    layerNum: 17,
    short: "Joh",
    name: "Pr. John & Family",
    role: "Branch Pastor",
    description: "Pastor John faithfully ministers God's word and leads the congregation with prayer, dedication, and pastoral care, reaching souls and nurturing spiritual growth.",
    image: "/images/pastors/pastor-01_-09_Joh.png"
  },
  {
    tag: "-08",
    layerNum: 16,
    short: "Ema",
    name: "Pr. Emmanuel & Family",
    role: "Branch Pastor",
    description: "Pastor Emmanuel serves with a strong calling to build strong believers and families, shepherding God's flock with humility, faith, and love.",
    image: "/images/pastors/pastor-02_-08_Ema.png"
  },
  {
    tag: "-07",
    layerNum: 15,
    short: "Pra",
    name: "Pr. Praise & Family",
    role: "Branch Pastor",
    description: "Pastor Praise ministers with vibrant enthusiasm for worship and community discipleship, impacting lives through the preaching of the Gospel.",
    image: "/images/pastors/pastor-03_-07_Pra.png"
  },
  {
    tag: "-06",
    layerNum: 14,
    short: "Chir",
    name: "Pr. Chiranjeevi & Sunitha",
    role: "House Church Pastor – Avadi",
    description: "Pastor Chiranjeevi leads the Avadi House Church, a place where believers experience intimate fellowship, deep discipleship, and Spirit-led worship. His wife, Sunitha, stands beside him as a strong support, ministering to women and families within the church.",
    image: "/images/pastors/pastor-04_-06_Chir.png"
  },
  {
    tag: "-05",
    layerNum: 13,
    short: "Thom",
    name: "Pr. Thomai Rajan & Meksha",
    role: "Branch Pastor – Kirubai A.G. Prayer House, Mangadu",
    description: "With a deep passion for prayer and intercession, Pastor Thomai Rajan leads Kirubai A.G. Prayer House in Mangadu, a church that has become a beacon of hope for those seeking healing and restoration. Alongside him, his wife Meksha plays a vital role in supporting women and families.",
    image: "/images/pastors/pastor-05_-05_Thom.png"
  },
  {
    tag: "-04",
    layerNum: 12,
    short: "Pet",
    name: "Pr. Peter & Family",
    role: "Branch Pastor",
    description: "Pastor Peter faithfully carries the Gospel message to the community, nurturing disciples and strengthening faith through prayer and the Word of God.",
    image: "/images/pastors/pastor-06_-04_Pet.png"
  },
  {
    tag: "-03",
    layerNum: 11,
    short: "Roy",
    name: "Pr. Royes & Theboral",
    role: "Branch Pastor – Almighty A.G. Prayer House, Kallikuppam",
    description: "Pastor Royes serves as the Pastor of Almighty A.G. Prayer House in Kallikuppam, leading the congregation with a deep commitment to prayer, worship, and the Word of God. He is joined in ministry by his wife, Theboral, who faithfully supports and serves alongside him.",
    image: "/images/pastors/pastor-07_-03_Roy.png"
  },
  {
    tag: "-02",
    layerNum: 10,
    short: "mani",
    name: "Pr. Manivannan & Rachel",
    role: "Branch Pastor – Jeevan A.G. Church, Morai",
    description: "Rev. Manivannan serves as the Pastor of Jeevan A.G. Church in Morai, faithfully leading the congregation with a heart for God and a passion for souls. He is supported in ministry by his wife, Rachel, who stands alongside him.",
    image: "/images/pastors/pastor-08_-02_mani.png"
  },
  {
    tag: "-01",
    layerNum: 9,
    short: "Jer",
    name: "Pr. Jerry Jemson & Vimisha Jemson",
    role: "Associate Pastor",
    description: "Pr. Jerry Jemson serves as the Associate Pastor at FLAG, leading the Youth, Children, Media, and Worship ministries. With a deep passion for the Gospel and a heart for the next generation, he is committed to equipping and empowering young people to grow in their faith. He is married to Vimisha Jemson, who stands alongside him in ministry.",
    image: "/images/pastors/pastor-09_-01_Jer.png"
  },
  {
    tag: "01",
    layerNum: 0,
    short: "Dad",
    name: "Rev. N. Johnson & Pastor Jemimah Johnson",
    role: "Senior Pastor",
    description: "Rev. N. Johnson serves as the Senior Pastor of Full Life Centre A.G. Church (FLAG), leading with a heart full of passion for God’s kingdom. With unwavering faith and dedication, he has been instrumental in pioneering and establishing the church, impacting countless lives in Thiruverkadu and beyond. He is joined in ministry by his wife, Pastor Jemimah Johnson.",
    image: "/images/pastors/pastor-10_01_Dad.png"
  },
  {
    tag: "02",
    layerNum: 1,
    short: "Jeru",
    name: "Jerusha Pearlin",
    role: "Worship & Youth Ministry Leader",
    description: "Jerusha Pearlin actively ministers in music, worship, and youth leadership at Full Life Centre A.G. Church, inspiring people to enter God's presence through heartfelt worship and dedication.",
    image: "/images/pastors/pastor-11_02_Jeru.png"
  },
  {
    tag: "03",
    layerNum: 2,
    short: "Bal",
    name: "Pr. Balaji & Rebecca",
    role: "Branch Pastor – Full Life A.G. Church, Alamathi",
    description: "Rev. Balaji serves as the Pastor of Full Life A.G. Church in Alamathi, with a special focus on ministering to the Gypsy community. His heart for the marginalized and his dedication to spreading the love of Christ have made a significant impact in the region. He is joined in ministry by his wife, Rebecca.",
    image: "/images/pastors/pastor-12_03_Bal.png"
  },
  {
    tag: "04",
    layerNum: 3,
    short: "Dan",
    name: "Pr. Daniel Vinayagam & Shanthi",
    role: "Evangelist",
    description: "Evangelist Daniel Vinayagam is a passionate and dedicated servant of God, traveling in and around Chennai to share the Gospel and bring souls to Christ. His wife, Shanthi, stands as a strong pillar of support, actively encouraging and praying for the ministry.",
    image: "/images/pastors/pastor-13_04_Dan.png"
  },
  {
    tag: "05",
    layerNum: 4,
    short: "Nag",
    name: "Pr. Nagaraj & Rasathi",
    role: "House Church Pastor – Kannapalayam",
    description: "Pastor Nagaraj leads the Kannapalayam House Church, a thriving home fellowship where people gather to worship, pray, and grow in God’s Word. His wife, Rasathi, plays a crucial role in ministering to women and families.",
    image: "/images/pastors/pastor-14_05_Nag.png"
  },
  {
    tag: "06",
    layerNum: 5,
    short: "Jos",
    name: "Pr. Joshua & Evangeline Shalomi",
    role: "Branch Pastor – Beth Shalom Revival AG Church, Ayyapanthangal",
    description: "Pr. Joshua leads the Ayyapanthangal Beth Shalom Revival AG Church, a thriving fellowship where people gather to worship, pray, and grow in God’s Word. His wife, Evangeline Shalomi, plays a crucial role in ministering to women and families.",
    image: "/images/pastors/pastor-15_06_Jos.png"
  },
  {
    tag: "07",
    layerNum: 6,
    short: "Sun",
    name: "Pr. Sundar & Brindha",
    role: "Branch Pastor – Blessing A.G. Church, Thiruthani",
    description: "Rev. Sundar serves as the Pastor of Blessing A.G. Church in Thiruthani, faithfully leading the congregation with a heart for God and a passion for seeing lives transformed through the Gospel. He is joined in ministry by his wife, Brindha.",
    image: "/images/pastors/pastor-16_07_Sun.png"
  },
  {
    tag: "08",
    layerNum: 7,
    short: "Vic",
    name: "Pr. Victor & Family",
    role: "Branch Pastor",
    description: "Pastor Victor serves the church community with devoted pastoral leadership, preaching, and family discipleship, expanding the kingdom of God.",
    image: "/images/pastors/pastor-17_08_Vic.png"
  },
  {
    tag: "09",
    layerNum: 8,
    short: "Jen",
    name: "Pr. Jenifer & Family",
    role: "Branch Pastor",
    description: "Pastor Jenifer ministers faithfully in outreach and church shepherding, bringing hope and spiritual guidance to families and youth.",
    image: "/images/pastors/pastor-18_09_Jen.png"
  }
];

export default pastorsDetails;