import React from 'react'
import card from './Cards.module.css';
import illu from '../../../assets/gt_illustration_6.svg';
import track from '../../../assets/track.svg';
import payslip from '../../../assets/payslip.svg';
const Cards = () => {
    return (
        <div className={card.cards}>
            <div className={card.cards1}>
                <div class={card.card}>
                    <strong className={card.cheader}>Review</strong>
                    <div className={card.in}>
                        <div>
                            <img src={illu} />
                            <p> Hurrah! You've nothing to review.</p>
                        </div>
                    </div>
                </div>

                <div class={card.cardin1}>
                    <strong className={card.cheader}>Quick Access</strong>
                    <div className={card.in1}>
                        <div>
                            <p>IT Statements</p>
                            <p>YTD Reports</p>
                            <p>Loan Statements</p>
                        </div>
                        <div className={card.intxt}>
                            <p className={card.intxtPara}>Use Quick Access to view important salary details</p>
                        </div>
                    </div>
                </div>

                <div class={card.cardin2}>
                    <strong className={card.cheader}>Track</strong>
                    <div className={card.in}>
                        <div>
                            <img src={track} />
                            <p>All good you have nothing to track.</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className={card.cards2}>
                <div class={card.cardin5}>
                    <div className={card.inSignIn}>
                        <div className={card.top}>
                            <div className={card.dates}>
                                <span>30 October 2024</span>
                                <span className={card.light}>Wednesday | General</span>
                                <sapn>14 : 56 : 10</sapn>
                            </div>
                            <div className={card.dot}></div>
                        </div>
                        <div className={card.bottom}>
                            <span>View Slips</span>
                            <button>Sign In</button>
                        </div>
                    </div>
                </div>

                <div class={card.cardin3}>
                    <strong className={card.cheader}>Payslip</strong>
                    <div className={card.in10}>
                        <div>
                            <img src={payslip} />
                            <p> Uh oh! Your Payslip will show up here after the release of Payroll</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className={card.cards3}>
                <div class={card.cardin3}>
                    <strong className={card.cheader}>Upcoming Holidays</strong>
                    <div className={card.in10}>
                        <div>
                            <img src={payslip} />
                            <p> Uh oh! Your Payslip will show up here after the release of Payroll</p>
                        </div>
                    </div>
                </div>

                <div class={card.cardin10}>
                <strong className={card.cheader}>It Decleration</strong>
                    <div className={card.inSignIn}>
                        <div className={card.top}>
                            <div className={card.dates}>
                                
                            </div>
                        </div>
                        <div className={card.bottom}>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Cards