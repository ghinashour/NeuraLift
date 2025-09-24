import React from 'react';
import '../../styles/SuccessStories/StatsCard.css';

const StatsCard = ({ stats }) => {
    const getIcon = (type) => {
        switch (type) {
            case 'totalStories':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9H4.5C3.83696 9 3.20107 8.73661 2.73223 8.26777C2.26339 7.79893 2 7.16304 2 6.5C2 5.83696 2.26339 5.20107 2.73223 4.73223C3.20107 4.26339 3.83696 4 4.5 4H6" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 9H19.5C20.163 9 20.7989 8.73661 21.2678 8.26777C21.7366 7.79893 22 7.16304 22 6.5C22 5.83696 21.7366 5.20107 21.2678 4.73223C20.7989 4.26339 20.163 4 19.5 4H18" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M4 22H20" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 14.6602V17.0002C10 17.5502 9.53 17.9802 9.03 18.2102C7.85 18.7502 7 20.2402 7 22.0002" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 14.6602V17.0002C14 17.5502 14.47 17.9802 14.97 18.2102C16.15 18.7502 17 20.2402 17 22.0002" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M18 2H6V9C6 10.5913 6.63214 12.1174 7.75736 13.2426C8.88258 14.3679 10.4087 15 12 15C13.5913 15 15.1174 14.3679 16.2426 13.2426C17.3679 12.1174 18 10.5913 18 9V2Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'totalLikes':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 14C20.49 12.54 22 10.79 22 8.5C22 7.04131 21.4205 5.64236 20.3891 4.61091C19.3576 3.57946 17.9587 3 16.5 3C14.74 3 13.5 3.5 12 5C10.5 3.5 9.26 3 7.5 3C6.04131 3 4.64236 3.57946 3.61091 4.61091C2.57946 5.64236 2 7.04131 2 8.5C2 10.8 3.5 12.55 5 14L12 21L19 14Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            case 'thisWeek':
                return (
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M11.525 2.29489C11.5688 2.20635 11.6365 2.13183 11.7205 2.07972C11.8044 2.02761 11.9012 2 12 2C12.0988 2 12.1956 2.02761 12.2795 2.07972C12.3635 2.13183 12.4312 2.20635 12.475 2.29489L14.785 6.97389C14.9372 7.28186 15.1618 7.5483 15.4396 7.75035C15.7174 7.95239 16.0401 8.08401 16.38 8.13389L21.546 8.88989C21.6439 8.90408 21.7358 8.94537 21.8115 9.00909C21.8871 9.07282 21.9434 9.15644 21.974 9.2505C22.0046 9.34456 22.0083 9.4453 21.9846 9.54133C21.9609 9.63736 21.9108 9.72485 21.84 9.79389L18.104 13.4319C17.8576 13.672 17.6733 13.9684 17.5668 14.2955C17.4604 14.6227 17.4351 14.9708 17.493 15.3099L18.375 20.4499C18.3923 20.5477 18.3817 20.6485 18.3445 20.7406C18.3073 20.8327 18.2449 20.9125 18.1645 20.9709C18.0842 21.0293 17.989 21.0639 17.8899 21.0708C17.7908 21.0777 17.6917 21.0566 17.604 21.0099L12.986 18.5819C12.6817 18.4221 12.3432 18.3386 11.9995 18.3386C11.6558 18.3386 11.3173 18.4221 11.013 18.5819L6.396 21.0099C6.30833 21.0563 6.2094 21.0772 6.11045 21.0701C6.0115 21.0631 5.91652 21.0285 5.83629 20.9701C5.75607 20.9118 5.69383 20.8321 5.65666 20.7401C5.61948 20.6482 5.60886 20.5476 5.626 20.4499L6.507 15.3109C6.5652 14.9716 6.53998 14.6233 6.43354 14.2959C6.32709 13.9686 6.14261 13.672 5.896 13.4319L2.16 9.79489C2.08859 9.72593 2.03799 9.63829 2.01396 9.54197C1.98993 9.44565 1.99344 9.34451 2.02408 9.25008C2.05472 9.15566 2.11127 9.07174 2.18728 9.00788C2.26329 8.94402 2.3557 8.90279 2.454 8.88889L7.619 8.13389C7.95926 8.08439 8.28239 7.95295 8.56058 7.75088C8.83878 7.54881 9.0637 7.28216 9.216 6.97389L11.525 2.29489Z" stroke="#FAFAFA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const getStatData = () => [
        {
            type: 'totalStories',
            value: stats.totalStories,
            label: 'Total Stories',
            iconClass: 'trophy'
        },
        {
            type: 'totalLikes',
            value: stats.totalLikes,
            label: 'Total Likes',
            iconClass: 'heart'
        },
        {
            type: 'thisWeek',
            value: stats.thisWeek,
            label: 'This Week',
            iconClass: 'star'
        }
    ];

    return (
        <div className="stats-card-unified">
            {getStatData().map((stat, index) => (
                <div key={stat.type} className="stat-section">
                    <div className={`stat-icon ${stat.iconClass}`}>
                        {getIcon(stat.type)}
                    </div>
                    <div className="stat-content">
                        <div className="stat-number">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCard;