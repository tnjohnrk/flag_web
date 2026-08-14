// pages/index.tsx
"use client";
import Image from 'next/image';
import React, { useRef, useState } from 'react';
import styles from './page.module.css';
import copyIcon from '../assets/copy.svg';
import flagQRCode from '../assets/flagQrcode.svg';
import { Landmark, QrCode, CreditCard, Tag, Banknote, Folder, KeyRound} from 'lucide-react';

export default function DonateUs() {
    const [activetab, setActiveTab] = useState();
    const qrcoderef = useRef(null);
    const neftref = useRef(null);

    const handletabclick = (tab) => {
        setActiveTab(tab);

        if (tab === 'UPI' && qrcoderef.current) {
            qrcoderef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        else if (tab === 'NEFT' && neftref.current) {
            neftref.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Correct relative path
    const Copybutton = ({ textToCopy }) => {
    const handlecopy = () => {
        navigator.clipboard.writeText(textToCopy);
    };
    return (
        <Image className={styles.copyimage} src={copyIcon} alt="copy" onClick={handlecopy}/>
    )};


    return (
        <div id="donate-us" className={styles.Donatepagecontainer}>
            <div className={styles.Donatecontainerone}>
                <p className={styles.DonateverseText}> God Loves a Cheerful Giver</p>
                <p className={styles.DonateverserefText}> 2 Corintians 9:7</p>  
                <div className={styles.Donationcontentsection}>
                    <div className={styles.Donatecontent}>
                        <div className={styles.waystooffercontainer}>
                            <p>Ways To Offer</p>
                        </div>
                        <div className={styles.Givingact}>
                            <div className={styles.Donationworship}>
                                GIVING IS AN ART OF WORSHIP
                            </div>
                        </div>
                        <div className={styles.DonationActContainer}>
                            <div className={styles.combineddonboxes}>
                                <div className={`${styles.Transferboxes} ${activetab === 'UPI' ? styles.activetab : ''}`} onClick={() => handletabclick('UPI')}>
                                    {/*<a href='qr-code-link' target='' className={styles.DonateTransferlink}>*/}
                                    <a  className={styles.DonateTransferlink}>
                                        <QrCode size={84}></QrCode>
                                        <p>UPI</p>
                                    </a>
                                </div>
                                <div className={`${styles.Transferboxes} ${activetab === 'NEFT' ? styles.activetab : ''}`} onClick={() => handletabclick('NEFT')}>
                                    {/*<a href='bank-link' target='' className={styles.DonateTransferlink}>*/}
                                    <a className={styles.DonateTransferlink}>
                                        <Landmark size={80}></Landmark>
                                        <p>NEFT/RTGS</p>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    {activetab && (
                        <div className={styles.DonationTabsection}>
                            {activetab === 'UPI' && <div className={styles.upiidscetion} ref={qrcoderef}>
                                <span className={styles.upititle}>UPI ID:</span>
                                <span className={styles.upiid}> FULLLIFECENTRE-2@OKAXIS</span>
                                <Copybutton textToCopy="FULLLIFECENTRE-2@OKAXIS" />
                            </div>
                            }
                            {activetab === 'UPI' && <div className={styles.gpaysection}>
                                <span className={styles.gpaytitle}>G Pay Number:</span>
                                <span className={styles.gpayid}>9841677587</span>
                                <Copybutton textToCopy="9841677587" />
                            </div>
                            }
                            {activetab === 'UPI' && (<div className={styles.upicontent}>
                                <Image src={flagQRCode} alt="UPI QR Code" className={styles.qrImage} />
                            </div>)}
                            {activetab === 'NEFT' && (<div className={styles.Neftcontent} ref={neftref}>
                                <small className={styles.neftacknowledgepolicy}>*Only for Indian citizens residing in India or abroad</small>
                                <p className={styles.neftacknowledge}>You can send your offerings directly via bank transfer using NEFT, RTGS or IMPS</p>
                                <div className={styles.timeline}>
                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}><Landmark size={21} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.neftcontentleft}>
                                                <p>Bank Name</p>
                                            </div>
                                            <div className={styles.neftcontentRight}>
                                                <p className={styles.neftrighttext}>Union Bank Of India</p>
                                                <Copybutton textToCopy="Union Bank Of India" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}><Banknote size={21} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.neftcontentleft}>
                                                <p>Branch</p>
                                            </div>
                                            <div className={styles.neftcontentRight}>
                                                <p className={styles.neftrighttext}>Thiruverkadu</p>
                                                <Copybutton textToCopy="Thiruverkadu" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}><CreditCard size={21} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.neftcontentleft}>
                                                <p>Account No</p>
                                            </div>
                                            <div className={styles.neftcontentRight}>
                                                <p className={styles.neftrighttext}>520101038444311</p>
                                                <Copybutton textToCopy="520101038444311" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}><Tag size={21} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.neftcontentleft}>
                                                <p>Account Name</p>
                                            </div>
                                            <div className={styles.neftcontentRight}>
                                                <p className={styles.neftrighttext}>Full life Centre Assembly of God</p>
                                                <Copybutton textToCopy="Full life Centre Assembly of God" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}><Folder size={21} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.neftcontentleft}>
                                                <p>Account Type</p>
                                            </div>
                                            <div className={styles.neftcontentRight}>
                                                <p className={styles.neftrighttext}>Savings Account</p>
                                                <Copybutton textToCopy="Savings Account" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.timelineItem}>
                                        <div className={styles.timelineIcon}><KeyRound size={21} /></div>
                                        <div className={styles.timelineContent}>
                                            <div className={styles.neftcontentleft}>
                                                <p>IFSC Code</p>
                                                </div>
                                            <div className={styles.neftcontentRight}>
                                                <p className={styles.neftrighttext}>UBIN0830046</p>
                                                  <Copybutton textToCopy="UBIN0830046" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            )}

                        </div>
                    )}
                    <div className={styles.Donationpolicy}>
                        <p>We apply good governance principles in our operations and are continually vigilant over our financial processes and accountability to the governing authorities.There is a strict no-refund policy in place that will deter attempts at money laundering or financial shenanigans through contributions to the church.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};