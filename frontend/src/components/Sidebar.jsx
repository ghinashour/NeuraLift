import React from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';
import logo from '../assets/logo.svg';
import avatarPlaceholder from "../assets/avatar.png";
const getNavIcon = (key, isActive) => {
  const strokeColor = isActive ? '#F1F5F9' : '#626A84';

  const icons = {
    dashboard: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12.5 17.5V10.8333C12.5 10.6123 12.4122 10.4004 12.2559 10.2441C12.0996 10.0878 11.8877 10 11.6667 10H8.33333C8.11232 10 7.90036 10.0878 7.74408 10.2441C7.5878 10.4004 7.5 10.6123 7.5 10.8333V17.5" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 8.33322C2.49994 8.09078 2.55278 7.85124 2.65482 7.63132C2.75687 7.4114 2.90566 7.21639 3.09083 7.05989L8.92417 2.06073C9.22499 1.80648 9.60613 1.66699 10 1.66699C10.3939 1.66699 10.775 1.80648 11.0758 2.06073L16.9092 7.05989C17.0943 7.21639 17.2431 7.4114 17.3452 7.63132C17.4472 7.85124 17.5001 8.09078 17.5 8.33322V15.8332C17.5 16.2753 17.3244 16.6992 17.0118 17.0117C16.6993 17.3243 16.2754 17.4999 15.8333 17.4999H4.16667C3.72464 17.4999 3.30072 17.3243 2.98816 17.0117C2.67559 16.6992 2.5 16.2753 2.5 15.8332V8.33322Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    timer: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8.33331 1.66675H11.6666" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 11.6667L12.5 9.16675" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.99998 18.3333C13.6819 18.3333 16.6666 15.3486 16.6666 11.6667C16.6666 7.98477 13.6819 5 9.99998 5C6.31808 5 3.33331 7.98477 3.33331 11.6667C3.33331 15.3486 6.31808 18.3333 9.99998 18.3333Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    tasks: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M17.5 8.75V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H14.5833" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.5 9.16659L10 11.6666L18.3333 3.33325" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    mood: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M15.8334 11.6667C17.075 10.45 18.3334 8.99167 18.3334 7.08333C18.3334 5.86776 17.8505 4.70197 16.9909 3.84243C16.1314 2.98289 14.9656 2.5 13.75 2.5C12.2834 2.5 11.25 2.91667 10 4.16667C8.75002 2.91667 7.71669 2.5 6.25002 2.5C5.03444 2.5 3.86866 2.98289 3.00911 3.84243C2.14957 4.70197 1.66669 5.86776 1.66669 7.08333C1.66669 9 2.91669 10.4583 4.16669 11.6667L10 17.5L15.8334 11.6667Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    stress: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M12.185 14.9141L3.28497 12.4866" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.3133 2.1851C15.4776 2.02084 15.6726 1.89054 15.8872 1.80165C16.1018 1.71275 16.3319 1.66699 16.5642 1.66699C16.7965 1.66699 17.0265 1.71275 17.2411 1.80165C17.4557 1.89054 17.6507 2.02084 17.815 2.1851C17.9793 2.34937 18.1096 2.54437 18.1984 2.75899C18.2873 2.97361 18.3331 3.20364 18.3331 3.43594C18.3331 3.66824 18.2873 3.89827 18.1984 4.11288C18.1096 4.3275 17.9793 4.52251 17.815 4.68677L14.4667 8.03594C14.3885 8.11407 14.3447 8.22004 14.3447 8.33052C14.3447 8.44101 14.3885 8.54697 14.4667 8.62511L15.2533 9.41177C15.6299 9.7884 15.8414 10.2992 15.8414 10.8318C15.8414 11.3644 15.6299 11.8751 15.2533 12.2518L14.4667 13.0384C14.3885 13.1166 14.2826 13.1604 14.1721 13.1604C14.0616 13.1604 13.9556 13.1166 13.8775 13.0384L6.96166 6.12344C6.88354 6.0453 6.83966 5.93934 6.83966 5.82885C6.83966 5.71837 6.88354 5.61241 6.96166 5.53427L7.74832 4.7476C8.12495 4.37103 8.63573 4.15948 9.16832 4.15948C9.70091 4.15948 10.2117 4.37103 10.5883 4.7476L11.375 5.53427C11.4531 5.61238 11.5591 5.65627 11.6696 5.65627C11.7801 5.65627 11.886 5.61238 11.9642 5.53427L15.3133 2.1851Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.49999 6.66675C5.99666 8.92508 4.19166 9.55008 2.01416 9.95675C1.94193 9.96994 1.87437 10.0017 1.81817 10.049C1.76196 10.0962 1.71904 10.1573 1.69363 10.2262C1.66823 10.2951 1.66122 10.3694 1.67329 10.4419C1.68537 10.5143 1.71611 10.5823 1.7625 10.6392L7.8625 18.0417C7.98639 18.1733 8.14972 18.2611 8.32784 18.2917C8.50596 18.3224 8.68922 18.2943 8.84999 18.2117C10.6125 17.0042 13.3333 13.9934 13.3333 12.5001" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    success: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M5.00002 7.49992H3.75002C3.19749 7.49992 2.66758 7.28043 2.27688 6.88972C1.88618 6.49902 1.66669 5.96912 1.66669 5.41659C1.66669 4.86405 1.88618 4.33415 2.27688 3.94345C2.66758 3.55275 3.19749 3.33325 3.75002 3.33325H5.00002" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 7.49992H16.25C16.8025 7.49992 17.3324 7.28043 17.7231 6.88972C18.1138 6.49902 18.3333 5.96912 18.3333 5.41659C18.3333 4.86405 18.1138 4.33415 17.7231 3.94345C17.3324 3.55275 16.8025 3.33325 16.25 3.33325H15" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.33331 18.3333H16.6666" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8.33331 12.2166V14.1666C8.33331 14.6249 7.94165 14.9832 7.52498 15.1749C6.54165 15.6249 5.83331 16.8666 5.83331 18.3332" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M11.6667 12.2166V14.1666C11.6667 14.6249 12.0584 14.9832 12.475 15.1749C13.4584 15.6249 14.1667 16.8666 14.1667 18.3332" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15 1.66675H5V7.50008C5 8.82616 5.52678 10.0979 6.46447 11.0356C7.40215 11.9733 8.67392 12.5001 10 12.5001C11.3261 12.5001 12.5979 11.9733 13.5355 11.0356C14.4732 10.0979 15 8.82616 15 7.50008V1.66675Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    challenges: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 18.3334C14.6024 18.3334 18.3334 14.6025 18.3334 10.0001C18.3334 5.39771 14.6024 1.66675 10 1.66675C5.39765 1.66675 1.66669 5.39771 1.66669 10.0001C1.66669 14.6025 5.39765 18.3334 10 18.3334Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 15C12.7614 15 15 12.7614 15 10C15 7.23858 12.7614 5 10 5C7.23858 5 5 7.23858 5 10C5 12.7614 7.23858 15 10 15Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9.99998 11.6666C10.9205 11.6666 11.6666 10.9204 11.6666 9.99992C11.6666 9.07944 10.9205 8.33325 9.99998 8.33325C9.07951 8.33325 8.33331 9.07944 8.33331 9.99992C8.33331 10.9204 9.07951 11.6666 9.99998 11.6666Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    collab: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M13.3334 17.5V15.8333C13.3334 14.9493 12.9822 14.1014 12.357 13.4763C11.7319 12.8512 10.8841 12.5 10 12.5H5.00002C4.11597 12.5 3.26812 12.8512 2.643 13.4763C2.01788 14.1014 1.66669 14.9493 1.66669 15.8333V17.5" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.50002 9.16667C9.34097 9.16667 10.8334 7.67428 10.8334 5.83333C10.8334 3.99238 9.34097 2.5 7.50002 2.5C5.65907 2.5 4.16669 3.99238 4.16669 5.83333C4.16669 7.67428 5.65907 9.16667 7.50002 9.16667Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M18.3333 17.5001V15.8334C18.3328 15.0948 18.0869 14.3774 17.6345 13.7937C17.182 13.2099 16.5484 12.793 15.8333 12.6084" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.3333 2.6084C14.0503 2.79198 14.6858 3.20898 15.1397 3.79366C15.5935 4.37833 15.8398 5.09742 15.8398 5.83757C15.8398 6.57771 15.5935 7.2968 15.1397 7.88147C14.6858 8.46615 14.0503 8.88315 13.3333 9.06673" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    schedule: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M6.66669 1.66675V5.00008" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.3333 1.66675V5.00008" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M15.8333 3.33325H4.16667C3.24619 3.33325 2.5 4.07944 2.5 4.99992V16.6666C2.5 17.5871 3.24619 18.3333 4.16667 18.3333H15.8333C16.7538 18.3333 17.5 17.5871 17.5 16.6666V4.99992C17.5 4.07944 16.7538 3.33325 15.8333 3.33325Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.5 8.33325H17.5" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    medicine: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M8.75002 17.0834L17.0834 8.75008C17.4728 8.36848 17.7826 7.91346 17.9951 7.41135C18.2075 6.90924 18.3183 6.36999 18.3211 5.82479C18.3239 5.27959 18.2185 4.73925 18.0111 4.23501C17.8038 3.73078 17.4985 3.27266 17.113 2.88714C16.7274 2.50162 16.2693 2.19635 15.7651 1.98898C15.2609 1.78161 14.7205 1.67625 14.1753 1.67901C13.6301 1.68176 13.0909 1.79257 12.5888 2.00502C12.0866 2.21747 11.6316 2.52736 11.25 2.91675L2.91669 11.2501C2.52729 11.6317 2.21741 12.0867 2.00496 12.5888C1.79251 13.0909 1.6817 13.6302 1.67895 14.1754C1.67619 14.7206 1.78155 15.2609 1.98892 15.7652C2.19629 16.2694 2.50156 16.7275 2.88708 17.113C3.2726 17.4985 3.73072 17.8038 4.23495 18.0112C4.73919 18.2186 5.27953 18.3239 5.82473 18.3212C6.36993 18.3184 6.90918 18.2076 7.41129 17.9951C7.9134 17.7827 8.36842 17.4728 8.75002 17.0834Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M7.08331 7.08325L12.9166 12.9166" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    assistant: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 4.16655C10.001 3.83324 9.93532 3.5031 9.80685 3.19555C9.67837 2.88799 9.4897 2.60923 9.25191 2.37567C9.01413 2.1421 8.73204 1.95844 8.42224 1.83549C8.11243 1.71254 7.78117 1.65278 7.44793 1.65972C7.1147 1.66667 6.78621 1.74018 6.4818 1.87593C6.17739 2.01169 5.9032 2.20694 5.67536 2.45022C5.44751 2.69349 5.27061 2.97987 5.15506 3.29251C5.03952 3.60515 4.98765 3.93774 5.00252 4.27071C4.51269 4.39666 4.05794 4.63242 3.67271 4.96014C3.28749 5.28786 2.98189 5.69894 2.77906 6.16225C2.57623 6.62556 2.48149 7.12896 2.50201 7.63431C2.52254 8.13965 2.65779 8.63371 2.89752 9.07905C2.476 9.42149 2.14454 9.86174 1.93197 10.3615C1.7194 10.8612 1.63215 11.4054 1.67782 11.9465C1.7235 12.4877 1.9007 13.0095 2.19403 13.4666C2.48735 13.9236 2.88791 14.3021 3.36085 14.569C3.30245 15.0209 3.3373 15.4799 3.46326 15.9178C3.58922 16.3557 3.8036 16.7631 4.09318 17.1148C4.38275 17.4666 4.74136 17.7553 5.14687 17.963C5.55238 18.1708 5.99617 18.2932 6.45083 18.3227C6.9055 18.3522 7.36139 18.2881 7.79034 18.1346C8.2193 17.981 8.61221 17.7411 8.94482 17.4297C9.27743 17.1183 9.54267 16.742 9.72416 16.3241C9.90565 15.9062 9.99953 15.4555 10 14.9999V4.16655Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M10 4.16655C9.99903 3.83324 10.0647 3.5031 10.1932 3.19555C10.3217 2.88799 10.5103 2.60923 10.7481 2.37567C10.9859 2.1421 11.268 1.95844 11.5778 1.83549C11.8876 1.71254 12.2189 1.65278 12.5521 1.65972C12.8853 1.66667 13.2138 1.74018 13.5182 1.87593C13.8226 2.01169 14.0968 2.20694 14.3247 2.45022C14.5525 2.69349 14.7294 2.97987 14.845 3.29251C14.9605 3.60515 15.0124 3.93774 14.9975 4.27071C15.4873 4.39666 15.9421 4.63242 16.3273 4.96014C16.7125 5.28786 17.0181 5.69894 17.221 6.16225C17.4238 6.62556 17.5185 7.12896 17.498 7.63431C17.4775 8.13965 17.3422 8.63371 17.1025 9.07905C17.524 9.42149 17.8555 9.86174 18.0681 10.3615C18.2806 10.8612 18.3679 11.4054 18.3222 11.9465C18.2765 12.4877 18.0993 13.0095 17.806 13.4666C17.5127 13.9236 17.1121 14.3021 16.6392 14.569C16.6976 15.0209 16.6627 15.4799 16.5368 15.9178C16.4108 16.3557 16.1964 16.7631 15.9069 17.1148C15.6173 17.4666 15.2587 17.7553 14.8532 17.963C14.4477 18.1708 14.0039 18.2932 13.5492 18.3227C13.0945 18.3522 12.6386 18.2881 12.2097 18.1346C11.7807 17.981 11.3878 17.7411 11.0552 17.4297C10.7226 17.1183 10.4574 16.742 10.2759 16.3241C10.0944 15.9062 10.0005 15.4555 10 14.9999V4.16655Z" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.5 10.8333C11.8004 10.5872 11.1894 10.1392 10.7444 9.54584C10.2994 8.95251 10.0404 8.24056 10 7.5C9.95962 8.24056 9.70056 8.95251 9.25556 9.54584C8.81057 10.1392 8.19963 10.5872 7.5 10.8333" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M14.6658 5.41659C14.8675 5.06707 14.9816 4.67393 14.9983 4.27075" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.0025 4.27075C5.01898 4.67386 5.13278 5.067 5.33417 5.41659" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2.89752 9.08C3.04997 8.95584 3.21311 8.84541 3.38502 8.75" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.615 8.75C16.7869 8.84541 16.95 8.95584 17.1025 9.08" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5.00001 15.0001C4.4257 15.0003 3.86106 14.8522 3.36084 14.5701" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16.6392 14.5701C16.1389 14.8522 15.5743 15.0003 15 15.0001" stroke={strokeColor} strokeWidth="1.66667" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  };

  return icons[key] || icons.dashboard;
};

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/Dashboard' },
  { key: 'timer', label: 'Focus Timer', path: '/focusTimer' },
  { key: 'tasks', label: 'Tasks', path: '/taskManager' },
  { key: 'mood', label: 'Mood Tracker', path: '/moodTracker' },
  { key: 'stress', label: 'Stress Relief', path: '/stressRelief' },
  { key: 'success', label: 'Success Stories', path: '/success-stories' },
  { key: 'challenges', label: 'Challenges', path: '/Challenges' },
  { key: 'collab', label: 'Collaborate', path: '/Collaborate' },
  { key: 'schedule', label: 'Schedule', path: '/Schedule' },
  { key: 'medicine', label: 'Medicine & Health', path: '/medicineHealth' },
  { key: 'assistant', label: 'AI Assistant', path: '/ai-assistant' }
];

const Sidebar = ({ isCollapsed, setIsCollapsed, user, loading = false }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (path) => {
    // Navigation for all items
    navigate(path);
  };

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <img src={logo} alt="NeuraLift" />
          </div>
          {!isCollapsed && (
            <>
              <div className="brand-name">NeuraLift</div>
              <div className="brand-sub">Your wellness companion</div>
            </>
          )}
        </div>


        <nav className="nav">
          {navItems.map((item) => (
            <div
              key={item.key}
              className={`nav-item ${isActive(item.path) ? "active" : ""}`}
              onClick={() => handleNavClick(item.path)}
              title={isCollapsed ? item.label : undefined} // tooltip when collapsed
            >
              {getNavIcon(item.key, isActive(item.path))}
              <span className="nav-label">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="profile-section">
            <div className="profile">
              {loading ? (
                <div className="profile-loading">
                  <div className="loading-avatar"></div>
                  {!isCollapsed && <div className="loading-username"></div>}
                </div>
              ) : (
                <Link to="/profile" className="profile-link" title={isCollapsed ? (user?.username || user?.name || "User") : undefined}>
                  <img
                    src={
                      user?.profilePhoto
                        ? `http://localhost:4000/uploads/${user.profilePhoto}`
                        : avatarPlaceholder
                    }
                    alt={user?.username || user?.name || "User"}
                    className="sidebar-avatar"
                    onError={(e) => {
                      // fallback to placeholder if image fails to load
                      e.target.src = avatarPlaceholder;
                    }}
                  />
                  {!isCollapsed && (
                    <span className="sidebar-username">{user?.username || user?.name || "User"}</span>
                  )}
                </Link>
              )}
            </div>

            <button
              className={`collapse-btn ${isCollapsed ? "floating" : ""}`}
              onClick={() => {
                console.log("Button clicked, isCollapsed:", isCollapsed);
                setIsCollapsed(!isCollapsed);
              }}
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              <svg className={`collapse-icon ${isCollapsed ? "rotated" : ""}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

