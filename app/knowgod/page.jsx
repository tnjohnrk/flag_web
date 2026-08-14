
// pages/donate.jsx
"use client";
import React, { useRef, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
// pages/donate.jsx



export default function KnowGod() {
    const [activeTab, setActiveTab] = useState('tab1');
    return (
        <div id="know-god" className={styles.knowGodContentWrapper}>
            <section className={styles.subKGheader}>
                <div className={styles.knowgodcontainerheader}>
                    <div className={styles.knowgodheaderrow}>
                        <div className={styles.knowgodcentercol}>
                            <h1 className={styles.Topheader}>Know God</h1>
                        </div>
                    </div>
                </div>
            </section>
            <section className={styles.subKGBody}>
                <div className={styles.knowgodcontainerbody}>
                    <div className={styles.knowgodbodyrow}>
                        <div className={styles.Knowgodcontentcontainer}>
                            <div className={styles.Knowgodcontentinnercontainer}>
                                <div className={styles.KnowgodcontentTotalTabSection}>
                                    <div className={styles.KnowgodcontentTotalTabSeprate}>
                                        <div className={styles.KnowGodTabonly}>
                                            <ul className={styles.KnowgodTablist}>
                                                <li className={`${styles.KnowGodtabItem} ${activeTab === 'tab1' ? styles.activeTab : ''}`}
                                                    onClick={() => setActiveTab('tab1')}>
                                                    <div className={styles.Knowgodcontenttab}>
                                                        <span>Who Is Jesus?</span>
                                                        <div className={styles.GoldIndicator}></div>
                                                    </div>
                                                </li>
                                                <li className={`${styles.KnowGodtabItem} ${activeTab === 'tab2' ? styles.activeTab : ''}`}
                                                    onClick={() => setActiveTab('tab2')}>
                                                    <div className={styles.Knowgodcontenttab}>
                                                        <span>Why Do I Need Jesus?</span>
                                                        <div className={styles.GoldIndicator}></div>
                                                    </div>
                                                </li>
                                                <li className={`${styles.KnowGodtabItem} ${activeTab === 'tab3' ? styles.activeTab : ''}`}
                                                    onClick={() => setActiveTab('tab3')}>
                                                    <div className={styles.Knowgodcontenttab}>
                                                        <span>How Do I  Receive Jesus?</span>
                                                        <div className={styles.GoldIndicator}></div>
                                                    </div>
                                                </li>
                                                <li className={`${styles.KnowGodtabItem} ${activeTab === 'tab4' ? styles.activeTab : ''}`}
                                                    onClick={() => setActiveTab('tab4')}>
                                                    <div className={styles.Knowgodcontenttab}>
                                                        <span>Next Step?</span>
                                                        <div className={styles.GoldIndicator}></div>
                                                    </div>
                                                </li>
                                            </ul>

                                        </div>
                                        <div key={activeTab} className={`${styles.KnowGodTabContent} ${styles.fadeIn}`}>
                                            {activeTab === 'tab1' && (
                                                <div className={styles.tabPane}>
                                                    <Image
                                                        src="/Images/WhoIsJesus.jpeg"
                                                        alt="Descriptive alt text"
                                                        width={300}
                                                        height={300}
                                                        className={styles.inlineImage}
                                                    />
                                                    <p className={styles.Knowgodpara}><span className={styles.highlightJesus}>Jesus</span> is more than just a historical figure or a great teacher—He is the Son of God, the Savior of the world, and the source of true life.</p>
                                                    <p className={styles.KnowgodparaHead}><strong>More Than a Teacher:</strong></p>
                                                    <p className={styles.Knowgodpara}>Throughout history, people have debated who Jesus is. Some saw Him as a wise man, a prophet, or a great moral leader. Others dismissed Him as a madman. But even His enemies understood that He was claiming to be more than just a man—that’s why they sought to crucify Him.</p>
                                                    <p className={styles.Knowgodpara}>The world’s calendar is centered around His life, marking B.C. (Before Christ) and A.D. (Anno Domini, "In the Year of Our Lord"). His influence is undeniable, but He is more than just a man of history—He is the Son of God.</p>
                                                    <p className={styles.KnowgodparaHead}><strong>The Power of Jesus:</strong></p>
                                                    <p className={styles.Knowgodpara}>Jesus’ time on earth was filled with miracles—healing the sick, raising the dead, calming storms, and feeding thousands. But His greatest miracles were His own birth and resurrection. These moments changed history and continue to transform lives today.</p>
                                                    <p className={styles.Knowgodpara}>His ultimate mission wasn’t just performing miracles—it was to save humanity. Through His death on the cross and His resurrection, He defeated sin and death, offering us forgiveness and eternal life. His blood shed on the cross is the only hope for salvation.</p>
                                                    <p className={styles.KnowgodparaHead}><strong>A Free Gift for All:</strong></p>
                                                    <p className={styles.Knowgodpara}>We don’t have to earn God’s love—Jesus offers salvation as a free gift to anyone who believes. He invites us to come to Him as we are, with our burdens and struggles, and receive the peace, love, and forgiveness that only He can give.</p>
                                                    <p className={styles.KnowgodparaHead}><strong>C.S. Lewis once said:</strong></p>
                                                    <p className={styles.Knowgodpara}> <em>"Many teachers have pointed the way, but Jesus said, ‘I AM the Way.’ Others have spoken of truth, but Jesus declared, ‘I AM the Truth.’ Others sought the meaning of life, but Jesus boldly claimed, ‘I AM the Life.’”</em></p>
                                                    <p className={styles.Knowgodpara}>Jesus is the answer to our deepest questions, the hope for our brokenness, and the only way to true freedom.</p>
                                                    <p className={styles.KnowgodparaHead}><strong>Are you ready to know Him?</strong></p>
                                                </div>
                                            )}
                                            {activeTab === 'tab2' && (
                                                <div className={styles.tabPane}>
                                                    <p className={styles.Knowgodpara}>Many people live chasing success, collecting achievements, and pursuing happiness. But at the end of it all, what truly matters?</p>
                                                    <p className={styles.KnowgodparaHead}><strong>1.Sin Separates Us from God:</strong></p>
                                                    <p className={styles.Knowgodpara}>No matter how good we try to be, sin has created a gap between us and God. The Bible says:
                                                        <em>"For all have sinned and fall short of the glory of God."</em><strong><em className={styles.knowgodverses}>– Romans 3:23</em></strong></p>
                                                    <p className={styles.Knowgodpara}>Left on our own, we are separated from God. But thankfully, God made a way for us to be restored.</p>
                                                    <p className={styles.KnowgodImage}>
                                                        <Image
                                                            src="/Images/KnowGodGospelImageA.jpeg"
                                                            alt="Descriptive alt text"
                                                            width={300}
                                                            height={200}
                                                            className={styles.inlineImage}
                                                        />
                                                    </p>
                                                    <p className={styles.KnowgodparaHead}><strong>2.We Cannot Save Ourselves:</strong></p>
                                                    <p className={styles.Knowgodpara}>We can’t earn our way back to God through good deeds or personal effort. Salvation is a gift—something we can’t achieve but only receive.
                                                        <em>"For it is by grace you have been saved, through faith—and this is not from yourselves, it is the gift of God."</em><strong><em className={styles.knowgodverses}>– Ephesians 2:8</em></strong></p>
                                                    <p className={styles.KnowgodImage}>
                                                        <Image
                                                            src="/Images/KnowGodGospellmageB.jpeg"
                                                            alt="Descriptive alt text"
                                                            width={300}
                                                            height={200}
                                                            className={styles.inlineImage}
                                                        />
                                                    </p>
                                                    <p className={styles.KnowgodparaHead}><strong>3.Only Jesus Can Save Us:</strong></p>
                                                    <p className={styles.KnowgodparaHead}>God, who created us, has a purpose for our lives. Jesus is the only way to be reunited with Him</p>
                                                    <p className={styles.Knowgodpara}><em>"I am the way and the truth and the life. No one comes to the Father except through me."</em><strong><em className={styles.knowgodverses}>– John 14:6</em></strong></p>
                                                    <p className={styles.Knowgodpara}>No other path leads to true salvation. Jesus is the bridge that reconnects us to God</p>
                                                    <p className={styles.KnowgodImage}>
                                                        <Image
                                                            src="/Images/KnowGodGospellmageC.jpeg"
                                                            alt="Descriptive alt text"
                                                            width={300}
                                                            height={200}
                                                            className={styles.inlineImage}
                                                        />
                                                    </p>
                                                    <p className={styles.KnowgodparaHeadRJ}><strong>4.Turn to Jesus and Believe:</strong></p>
                                                    <p className={styles.KnowgodparaHead}>If you are ready to trust Jesus as your Savior, He is waiting for you with open arms.</p>
                                                    <p className={styles.Knowgodpara}><em>"Salvation is found in no one else, for there is no other name under heaven given to mankind by which we must be saved."</em><strong><em className={styles.knowgodverses}>– Acts 4:12</em></strong></p>
                                                  
                                                    <p className={styles.KnowgodparaHeadRJ}><strong>What Must I Do to Be Saved?</strong></p>
                                                    <p className={styles.Knowgodpara}>The Bible gives a clear answer:</p>
                                                    <p className={styles.Knowgodpara}><em>"If you confess with your mouth, 'Jesus is Lord,' and believe in your heart that God raised him from the dead, you will be saved."</em><strong><em className={styles.knowgodverses}>– Romans 10:9</em></strong></p>
                                                    <p className={styles.Knowgodpara}>Maybe you think you’ve made too many mistakes or gone too far from God. But nothing is beyond His mercy. Jesus offers forgiveness, a fresh start, and a new life to all who believe in Him.</p>
                                                    <p className={styles.Knowgodpara}><em>"To all who did receive Him, to those who believed in His name, He gave the right to become children of God."</em><strong><em className={styles.knowgodverses}>–John 1:12</em></strong></p>
                                                    <p className={styles.KnowgodImage}>
                                                        <Image
                                                            src="/Images/KnowGodGospellmageD.jpeg"
                                                            alt="Descriptive alt text"
                                                            width={300}
                                                            height={200}
                                                            className={styles.inlineImage}
                                                        />
                                                    </p>
                                                    <p className={styles.KnowgodparaHeadRJ}><strong>Are you ready to take that step?</strong></p>

                                                </div>
                                            )}
                                            {activeTab === 'tab3' && (
                                                <div className={styles.tabPane}>
                                                    <p className={styles.KnowgodparaHeadRJ}><strong>Jesus offers forgiveness, hope, and a new beginning. Here’s how you can invite Him into your life:</strong></p>
                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>1.Admit You Need a Savior:</span> We have all sinned and need God's forgiveness
                                                    </p>
                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>2.Turn from Your Sins:</span> Repentance means choosing to follow Jesus and leave behind a life of sin.
                                                    </p>

                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>3.Believe in Jesus:</span> Jesus died for your sins and rose again. Through Him, you can have eternal life.
                                                    </p>

                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>4.Invite Jesus into Your Life:</span>Surrender to Him and let Him guide you
                                                    </p>

                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>5.Pray and Receive Jesus:</span>If you’re ready, pray this simple prayer:
                                                    </p>

                                                    <div className={`${styles.salvation_prayer_border} max-w-xl mx-auto p-6 bg-white rounded-2xl shadow-lg border border-gray-200 mt-6`}>
                                                        <h2 className="text-2xl font-semibold text-black-700 mb-4 text-center">
                                                            Prayer of Salvation
                                                        </h2>
                                                      
                                                            <blockquote className={styles.KnowgodBQ}> “Father, I believe Jesus died for my sins and rose again. I confess I need Your forgiveness. I invite You into my life. I want to follow You as my Lord and Savior. In Jesus’ name, Amen.”</blockquote>

                                                       
                                                    </div>



                                                    <p className={styles.Knowgodparawelcome}>
                                                        <strong>Welcome to God’s Family!</strong>
                                                    </p>
                                                    <p className={styles.Knowgodpara}>If you prayed this prayer, you have started a new journey with Jesus! We’d love to connect with you—fill out the form below so we can support you.</p>


                                                    <form className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl space-y-4">
                                                        <h2 className="text-2xl font-semibold text-center mb-4" style={{ color: '#d77b2a' }}>
                                                            Connect With Us
                                                        </h2>
                                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block font-bold mb-1">First Name <span className="text-red-500">*</span></label>
                                                                <input type="text" name="firstName"
                                                                    className="w-full border rounded-lg p-2" required />
                                                            </div>
                                                            <div>
                                                                <label className="block font-bold mb-1">Last Name <span className="text-red-500">*</span></label>
                                                                <input type="text" name="lastName"
                                                                    className="w-full border rounded-lg p-2" required />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block font-bold mb-1">Mobile Number <span className="text-red-500">*</span></label>
                                                            <div className="flex items-center space-x-2">
                                                                <span className="px-3 py-2 border rounded-md bg-gray-100">+91</span>
                                                                <input type="tel" name="mobileNumber"
                                                                    className="w-full border rounded-lg p-2" required />
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="block font-bold mb-1">Email Address <span className="text-red-500">*</span></label>
                                                            <input type="email" name="email"
                                                                className="w-full border rounded-lg p-2" required />
                                                        </div>

                                                        <div>
                                                            <label className="block font-bold mb-1">Which city you reside in? <span className="text-red-500">*</span></label>
                                                            <input type="text" name="city"
                                                                className="w-full border rounded-lg p-2" required />
                                                        </div>

                                                        <div>
                                                            <label className="block font-bold mb-1">Your Religious Background? <span className="text-red-500">*</span></label>
                                                            <input type="text" name="religiousBackground"
                                                                className="w-full border rounded-lg p-2" required />
                                                        </div>

                                                        <div>
                                                            <label className="block font-bold mb-1">How long you have been watching us Online? <span className="text-red-500">*</span></label>
                                                            <input type="text" name="watchingDuration"
                                                                className="w-full border rounded-lg p-2" required />
                                                        </div>

                                                        <div className="flex items-start space-x-2">
                                                            <input type="checkbox" name="consent"
                                                                className="mt-1" required />
                                                            <label className="text-sm">
                                                                Yes, I give my consent to call me on my phone and add me to your Communication Channels (SMS, WhatsApp).
                                                            </label>
                                                        </div>

                                                        <div className="text-center pt-4">
                                                            <button
                                                                type="submit"
                                                                className="text-white px-6 py-2 rounded-lg transition" style={{ backgroundColor: '#d77b2a' }}>
                                                                Submit
                                                            </button>

                                                        </div>
                                                    </form>
                                                </div>

                                            )}
                                            {activeTab === 'tab4' && (
                                                <div className={styles.tabPane}>
                                                    <Image
                                                        src="/Images/NextStepimage.jpeg"
                                                        alt="Descriptive alt text"
                                                        width={300}
                                                        height={300}
                                                        className={styles.inlineImage}
                                                    />

                                                    <p className={styles.KnowgodparaHeadNS}><strong>Your Next Steps with Jesus:</strong></p>
                                                    <p className={styles.Knowgodpara}>The moment you made Jesus your personal Lord and Savior, you took your first step toward the life God intended for you. The Bible says:</p>

                                                    <p className={`${styles.Knowgodpara} pl-7`}>
                                                        <em>"For you were once darkness, but now you are light in the Lord. Live as children of light."</em>
                                                        <strong><em className={styles.knowgodverses}>  –Ephesians 5:8</em></strong>
                                                    </p>


                                                   
                                                    <p className={styles.KnowgodparaHeadNSP}><strong>Follow these steps to grow in your faith:</strong></p>

                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>1.Obey Jesus’ Teachings:</span> Jesus commanded His followers to make disciples, baptize them, and teach them to obey His word.<strong><em className={styles.knowgodverses}>  –Matthew 28:18-20</em></strong>
                                                    </p>
                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>2.Spend Time with God Daily:</span> Build a personal relationship with Jesus through prayer and reading His Word.
                                                    </p>

                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>3.Stay Connected with Fellow Believers:</span>Join a group where you can grow spiritually and encourage others:

                                                    </p>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div className="bg-gray-100 p-4 rounded-xl shadow-sm">🙏 Church Prayer Gatherings</div>
                                                        <div className="bg-gray-100 p-4 rounded-xl shadow-sm">🏠 House Cell Groups</div>
                                                        <div className="bg-gray-100 p-4 rounded-xl shadow-sm">📖 Bible Studies</div>
                                                    </div>
                                                    <p className={styles.Knowgodparakeystep}>
                                                        <span className={styles.knowgodkeyStep}>4.Worship with Us Every Sunday:</span>Gather with us to worship and grow in faith:
                                                    </p>
                                                    <div className="border-l-4 border-purple-700 pl-4 pt-4 space-y-4">
                                                        <div>⏰ 6 AM – First Service</div>
                                                        <div>⏰ 8:30 AM – Second Service</div>
                                                        <div>⏰ 11 AM – Third Service</div>
                                                        <div>⏰ 6:30 PM – Evening Service</div>
                                                    </div>

                                                    <p className="mt-6 text-gray-700 italic">
                                                        We are excited to walk this journey with you!
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
