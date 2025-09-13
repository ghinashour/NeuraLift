import "../styles/features.css";

const Features = () => {
  return (
      <section id="Features" className="h-screen flex items-center justify-center bg-green-100 " style={{color:"#ffffff"}}>
    <div className="container">
      <h1 style={{ textAlign: "center",color:"#2A303C" }}>Everything You Need for Growth</h1>
      <p style={{ color: "#98A1B3", textAlign: "center" }}>
        NeuraLift combines powerful productivity tools with wellness features to
        help you achieve your goals while maintaining your mental health.
      </p>
      <div className="box-container">
        <div className="box" id="box1">
          <svg
            style={{
              marginLeft: "10px",
              marginTop: "40px",
              marginBottom: "20px",
            }}
            width="65"
            height="65"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.236694"
              y="0.41748"
              width="64"
              height="64"
              rx="16"
              fill="url(#paint0_linear_40_316)"
            />
            <path
              d="M44.2367 30.4175V41.7508C44.2367 42.4581 43.9557 43.1363 43.4556 43.6364C42.9555 44.1365 42.2773 44.4175 41.57 44.4175H22.9034C22.1961 44.4175 21.5178 44.1365 21.0177 43.6364C20.5176 43.1363 20.2367 42.4581 20.2367 41.7508V23.0841C20.2367 22.3769 20.5176 21.6986 21.0177 21.1985C21.5178 20.6984 22.1961 20.4175 22.9034 20.4175H39.57"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M28.2367 31.0841L32.2367 35.0841L45.57 21.7507"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_40_316"
                x1="0.236694"
                y1="0.41748"
                x2="64.2367"
                y2="64.4175"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3C8AF6" />
                <stop offset="1" stop-color="#76ABF4" />
              </linearGradient>
            </defs>
          </svg>
          <br></br>
          <b className="tasks-title">Task Management</b>
          <p className="expression">
            Stay organized and motivated with our intelligent task management
            system that adapts to your workflow.
          </p>
        </div>
        <div className="box">
          <svg
            style={{
              marginLeft: "10px",
              marginTop: "40px",
              marginBottom: "20px",
            }}
            width="65"
            height="65"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.236694"
              y="0.41748"
              width="64"
              height="64"
              rx="16"
              fill="url(#paint0_linear_40_323)"
            />
            <path
              d="M26.77 43.0841C29.3148 44.3895 32.2421 44.7431 35.0245 44.0812C37.8069 43.4192 40.2614 41.7852 41.9457 39.4737C43.6299 37.1622 44.4332 34.3251 44.2108 31.4737C43.9883 28.6223 42.7548 25.9441 40.7324 23.9217C38.71 21.8993 36.0318 20.6658 33.1804 20.4434C30.329 20.2209 27.4919 21.0242 25.1804 22.7085C22.8689 24.3927 21.2349 26.8472 20.573 29.6296C19.911 32.412 20.2646 35.3394 21.57 37.8841L18.9033 45.7508L26.77 43.0841Z"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_40_323"
                x1="0.236694"
                y1="0.41748"
                x2="64.2367"
                y2="64.4175"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#1A994F" />
                <stop offset="1" stop-color="#1BBB5E" />
              </linearGradient>
            </defs>
          </svg>
          <br></br>
          <b className="tasks-title">Daily Motivation</b>
          <p class className="expression">
            Get inspired every day with personalized quotes and connect with
            others on similar journeys.
          </p>
        </div>
        <div className="box">
          <svg
            style={{
              marginLeft: "10px",
              marginTop: "40px",
              marginBottom: "20px",
            }}
            width="65"
            height="65"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.236694"
              y="0.41748"
              width="64"
              height="64"
              rx="16"
              fill="url(#paint0_linear_40_329)"
            />
            <path
              d="M34.2367 25.7508C34.6049 25.7508 34.9034 25.4523 34.9034 25.0841C34.9034 24.716 34.6049 24.4175 34.2367 24.4175C33.8685 24.4175 33.5701 24.716 33.5701 25.0841C33.5701 25.4523 33.8685 25.7508 34.2367 25.7508Z"
              fill="white"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M39.57 31.0841C39.9382 31.0841 40.2367 30.7856 40.2367 30.4174C40.2367 30.0492 39.9382 29.7507 39.57 29.7507C39.2018 29.7507 38.9033 30.0492 38.9033 30.4174C38.9033 30.7856 39.2018 31.0841 39.57 31.0841Z"
              fill="white"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M27.57 27.0841C27.9382 27.0841 28.2367 26.7856 28.2367 26.4174C28.2367 26.0492 27.9382 25.7507 27.57 25.7507C27.2018 25.7507 26.9033 26.0492 26.9033 26.4174C26.9033 26.7856 27.2018 27.0841 27.57 27.0841Z"
              fill="white"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M24.9034 33.7508C25.2716 33.7508 25.57 33.4523 25.57 33.0841C25.57 32.716 25.2716 32.4175 24.9034 32.4175C24.5352 32.4175 24.2367 32.716 24.2367 33.0841C24.2367 33.4523 24.5352 33.7508 24.9034 33.7508Z"
              fill="white"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M32.2367 19.0842C24.9033 19.0842 18.9033 25.0842 18.9033 32.4176C18.9033 39.7509 24.9033 45.7509 32.2367 45.7509C33.4713 45.7509 34.434 44.7562 34.434 43.5002C34.434 42.9176 34.194 42.3869 33.8513 42.0002C33.4647 41.6149 33.2673 41.1309 33.2673 40.5002C33.2623 40.2068 33.3163 39.9153 33.4263 39.6432C33.5363 39.3711 33.6999 39.1239 33.9075 38.9164C34.115 38.7088 34.3622 38.5452 34.6343 38.4352C34.9064 38.3252 35.1979 38.2712 35.4913 38.2762H38.1527C42.2207 38.2762 45.5593 34.9389 45.5593 30.8709C45.5233 24.4336 39.518 19.0842 32.2367 19.0842Z"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_40_329"
                x1="0.236694"
                y1="0.41748"
                x2="64.2367"
                y2="64.4175"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#895AF6" />
                <stop offset="1" stop-color="#A684F5" />
              </linearGradient>
            </defs>
          </svg>
          <br></br>

          <b className="tasks-title">Creative Canvas</b>
          <p className="expression">
            Express yourself and release stress through our digital drawing
            platform designed for mindfulness.
          </p>
        </div>
        <div className="box">
          <svg
            style={{
              marginLeft: "10px",
              marginTop: "40px",
              marginBottom: "20px",
             
            }}
            width="65"
            height="65"
            viewBox="0 0 65 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="0.236694"
              y="0.41748"
              width="64"
              height="64"
              rx="16"
              fill="url(#paint0_linear_40_339)"
            />
            <path
              d="M41.57 35.0841C43.5567 33.1375 45.57 30.8041 45.57 27.7508C45.57 25.8059 44.7974 23.9406 43.4221 22.5654C42.0468 21.1901 40.1816 20.4175 38.2367 20.4175C35.89 20.4175 34.2367 21.0841 32.2367 23.0841C30.2367 21.0841 28.5833 20.4175 26.2367 20.4175C24.2917 20.4175 22.4265 21.1901 21.0512 22.5654C19.6759 23.9406 18.9033 25.8059 18.9033 27.7508C18.9033 30.8175 20.9033 33.1508 22.9033 35.0841L32.2367 44.4175L41.57 35.0841Z"
              stroke="white"
              stroke-width="2.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <defs>
              <linearGradient
                id="paint0_linear_40_339"
                x1="0.236694"
                y1="0.41748"
                x2="64.2367"
                y2="64.4175"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#3C8AF6" />
                <stop offset="1" stop-color="#76ABF4" />
              </linearGradient>
            </defs>
          </svg>
          <br></br>
          <b className="tasks-title">Health Tracking</b>
          <p className="expression">
            Monitor your mental and physical wellbeing with comprehensive health
            tracking tools.
          </p>
        </div>
      </div>
    </div>
    </section>
  );
};

export default Features;
