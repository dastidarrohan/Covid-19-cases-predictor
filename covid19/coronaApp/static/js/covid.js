const app = document.querySelector('#covid');
const ApiContext = React.createContext(null);
const DataContext = React.createContext(null);

function useStats(url) {
  const [stats,setStats] = React.useState();
  const [loading, setLoading] = React.useState(true);
  const [error,setError] = React.useState(false);
  React.useEffect(()=> {
    async function fetchData() {
      console.log('fetching API');
      const data = await fetch(url);
			
			data
				.json()
			  .then(res => setStats(res))
			  .then(res => setLoading(false))
				.catch(err => setError(err));
      };
    fetchData();
  },[url]);
  //
  return {
    stats,
    loading,
    error,
  }
}
function Daily({todayStat}) {
  const {state} = React.useContext(ApiContext);
  const {data} = React.useContext(DataContext);
  const today = new Date();
  const dayBefore = new Date();
  dayBefore.setDate(dayBefore.getDate() -1);
  
  const [month,day,year] = [dayBefore.getMonth()+1,dayBefore.getDate(),dayBefore.getFullYear()];
  let yesterday = `${month}-${day}-${year}`;
  if(yesterday.length<=9) {yesterday='0' + yesterday}
  
  const {stats,loading,error} =useStats(`https://covid19.mathdro.id/api/daily/${yesterday}`);
  if(stats) setTodayData(stats); 
  if(loading) return <p>Looking for data...</p>;
  if(error) return <p>Aw Man! No Data!</p>;
  //Daily stats values are String
  const prevDay = todayData.filter(e=>e.provinceState===isState).reduce((a,b)=>{return a+ parseInt(b.confirmed)},0);
console.log(todayStat,prevDay,yesterday)
  return (
    <div>
      <p>Daily Change(Today): + {(todayStat - prevDay).toLocaleString()}</p>
      
    </div>
   )
}
function Weekly({todayStat}) {
  const {state} = React.useContext(ApiContext);
  const {data} = React.useContext(DataContext);
  const prevWeek = new Date();
  prevWeek.setDate(prevWeek.getDate() -7);
  //console.log(today)
  const [month,day,year] = [today.getMonth()+1,today.getDate(),today.getFullYear()];
  const yesterday = `${month}-${day}-${year}`;
  
  const {stats,loading,error} =useStats(`https://covid19.mathdro.id/api/daily/${yesterday}`);
  if(stats) setTodayData(stats); 
  if(loading) return <p>Looking for data...</p>;
  if(error) return <p>Aw Man! No Data!</p>;
  //Daily stats values are String
  const dailyChange = todayData.filter(e=>e.provinceState===isState).reduce((a,b)=>{return a+ parseInt(b.confirmed)},0);

  return (
    <div>
      {dailyChange !== 0 ? <p>Daily Change: + {(todayStat - dailyChange).toLocaleString()}</p> : ''}
      
    </div>
   )
  
}
function WorldStats() {
  const url="https://covid19.mathdro.id/api/"
  const {stats,loading,error} = useStats(url);
  //console.log('log',stats,loading,error);
  if(loading) return <p>Looking for stats...</p>
  if(error) return <p>Aw Man!No Stats!</p>;
  
  return (
      <div className='box'>
        <div className='stat-box'>
          <h3>Confirmed:</h3>
          <span className='confirmed'>
            {stats.confirmed.value.toLocaleString()}
          </span>
        </div>
        <div className='stat-box'>
          <h3>Deaths:</h3>
          <span className='deaths'>{stats.deaths.value.toLocaleString()}</span>
        </div>
        <div className='stat-box'>
          <h3>Recovered:</h3>
          <span className='recovered'>{stats.recovered.value.toLocaleString()}</span>
        </div>
     </div>
  )
}

function CountrySelector() {
  const {country} = React.useContext(ApiContext);
  
  const {stats:countries,loading,error} = useStats("https://covid19.mathdro.id/api/countries/");
  if(loading) return <p>Looking for data...</p>;
  if(error) return <p>Aw Man! No Data!</p>;
  
  const keys = (countries.countries).map(e=>e.name);
    
  return(
    <div className='selector'>
      <h3>
        COVID-19 Cases for Country: <br /><span>{isCountry}</span>
      </h3>
      <select  onChange={e=>setIsCountry(e.target.value)}>
        {keys.map((key) =>(<option selected={key===isCountry} key={key} value={key}>{key}</option>))}
      </select>
    </div> 
  )
}

function CountryStats() {
  const {country} = React.useContext(ApiContext);
  const url = `https://covid19.mathdro.id/api/countries/${isCountry}`;
 
  const {stats,loading,error} = useStats(url);
    if(loading) return <p>Looking for stats...</p>
    if(error) return <p>Aw Man!No Stats!</p>;
   //console.log('log',stats,loading,error);
  return(
   
    <div className='box'>
      
        <div className='stat-box'>
          <h3>Confirmed:</h3>
          <span className='confirmed'>
            {stats.confirmed.value.toLocaleString()}
          </span>
        </div>
        <div className='stat-box'>
          <h3>Deaths:</h3>
          <span className='deaths'>{stats.deaths.value.toLocaleString()}</span>
        </div>
        <div className='stat-box'>
          <h3>Recovered:</h3>
          <span className='recovered'>{stats.recovered.value.toLocaleString()}</span>
        </div>
     </div>
    )
}

function StateSelector() {
  const {country, state} = React.useContext(ApiContext);
  const {data} = React.useContext(DataContext);
//console.log(isCountry)  
  React.useEffect(() => {
    if(isState!=='Texas' || isCountry!=='US') setIsState(null);
    
    //console.log('useSel',)
  },[isCountry])
  const {stats,loading,error} =useStats(`https://covid19.mathdro.id/api/countries/${isCountry}/confirmed`);
  if(stats) setIsData(stats); 
  if(loading) return <p>Looking for data...</p>;
  if(error) return <p>Aw Man! No Data!</p>
   
  const duplicateStates = isData.map(obj => obj.provinceState);
  const states = [...new Set(duplicateStates)];
//testing
  const noNullStates = states.filter(s=>s);
console.log('STsel',states[0],isState,isCountry,isData); 
  
  return(
    
    <div className='selector'>
      <h3>
           <br />
        <span>{isData[1] ? 'COVID-19 Cases by State/Province:' : 'No State/Province Data'}</span>
      </h3>
      <select  onChange={e=>setIsState(e.target.value)}><option>Select State/Province</option>
        {noNullStates.map((key) =>(<option selected={key===isState} key={key} value={key}>{key}</option>))}
      </select>
      
  </div> 
  )
}

function StateStats() {
  const {country, state} = React.useContext(ApiContext);
  const {data} = React.useContext(DataContext);
   
//Working with data array
//console.log('ST',states, isState, isCountry,)
  
  const stateStats = isData.filter(key=>(key.provinceState===isState));
//console.log('SSt',isState,stateStats);
  
    let confirmed = stateStats.reduce((a,b)=>{return a+b.confirmed},0).toLocaleString();
    let deaths = stateStats.reduce((a,b)=>{return a+b.deaths},0).toLocaleString();
    let recovered = stateStats.reduce((a,b)=>{return a+b.recovered},0).toLocaleString();
    
   
  return(
    <div>
    <Daily todayStat={parseInt(confirmed.replace(/\,/g,''))}/>
      
    <div className='box'>
      
        <div className='stat-box'>
          {isState && <h3>Confirmed:</h3>}
          <span className='confirmed'>
            { isState && confirmed}
          </span>
        </div>
        <div className='stat-box'>
          {isState &&<h3>Deaths:</h3>}
          <span className='deaths'>{isState && deaths}</span>
        </div>
        <div className='stat-box'>
          {isState &&<h3>Recovered:</h3>}
          <span className='recovered'>{isState && recovered}</span>
        </div>
     </div>
   </div>
  )
}

function CountyStats() {
  const {state} = React.useContext(ApiContext);
  const {data} = React.useContext(DataContext);
//console.log(isState);
  const countyByState = isData.filter(e=>e.provinceState===isState);
  
  const allCounties = countyByState.map(prov=> [prov.combinedKey,prov.confirmed,prov.deaths]);
  const topTen = allCounties.filter(county => allCounties.indexOf(county)<10);
  const topTenObj = topTen.map(key => [key[0],[key[1],key[2]]]);
  const tops = Object.entries(topTenObj);
  const topTenStats = tops.map(a=>{let city=a[1][0];let confirmed=a[1][1][0];let deaths=a[1][1][1];return {city,confirmed,deaths}});
   
  const isCounty = isData.every(e=>e.admin2===null);
  
//console.log('County',countyByState, topTen,isCounty);
  
  return(
     <div>
    
      <h3><br />
        { (!isCounty) ?<span>Top Ten Cases by County: </span> : 'No County Data'}
      </h3>
      <br />
      { (!isCounty) &&<div className='box'>
        {
          topTenStats.map(stat=>(<div className='stat-box'><h3>{stat.city.toLocaleString()}</h3><br /><span className='confirmed'>Confirmed: {stat.confirmed.toLocaleString()}</span><br /><span className='deaths'>Deaths: {stat.deaths.toLocaleString()}</span></div>))
          } 
         </div>} 
    </div>
  )
}

function MyRegion() {
  const {state} = React.useContext(ApiContext);
  const {data} = React.useContext(DataContext);
  
  const counties = ['Anderson','Angelina','Brazos','Cherokee','Houston','Leon','Madison','Nacogdoches','Trinity','Walker'];
  const myCounties = isData.filter(e => e.provinceState === 'Texas').filter(rgn => counties.includes(rgn.admin2));
  const hasData = myCounties.map(c=>c.admin2);
  const noData = counties.filter(e=>!hasData.includes(e));
  
  const isTexas = (isState === 'Texas');
//console.log(myCounties,noData); 
  return (
    <div>
      <h3><br />
        { (isTexas) && <span>Houston County Region: </span>}
      </h3>
      <br />
      { (isTexas) &&<div className='box'>
        {
          myCounties.map(stat=>(<div className='stat-box'><h3>{stat.admin2}</h3><br /> <span className='confirmed'>Confirmed: {stat.confirmed.toLocaleString()}</span><br /><span className='deaths'>Deaths: {stat.deaths.toLocaleString()}</span></div>))
          } 
      {noData.map(e=><div className='stat-box'><h3>{e}</h3><br /><span className='deaths'>No Reported Cases</span></div>)}
        </div>}
    </div>
    
  )
}

function Footer() {
  
  return (
    <div className='footer'>
  <h3 className='recovered'>Serving data from Johns Hopkins University CSSE as a JSON API</h3>
      <p>Thanks to <a href='https://github.com/mathdroid/covid-19-api' >mathdroid</a> for creating the API!</p>
      <p>App created by <a href='https://twitter.com/drcberry' target='_blank'>@drcberry</a> at </p>
      <footer>
  <a href='https://musedragonmedia.com' target='_blank'><img className='footer-logo' src={'https://hosting.musedragonmedia.com/assets/img/logo.png'} alt='Muse Dragon Media LLC' /></a>
</footer>
      </div>)
}

function App() {
  
  const apiStore = {
 country: [isCountry, setIsCountry]=React.useState('US'), state: [isState, setIsState]=React.useState('Texas'),
  region: [isRegion, setIsRegion]=React.useState()  
}

  const dataStore = {
    data: [isData, setIsData] = React.useState([]),
    daily: [todayData, setTodayData] = React.useState([]), yesterday:[dayBeforeData, setDayBeforeData] = React.useState([]),twoBefore: [twoDaysBeforeData, setTwoDaysBeforeData] = React.useState([]), threeBefore: [threeDaysBeforeData, setThreeDaysBeforeData] = React.useState([])
  }
  
  return(
    <div>
      <ApiContext.Provider value={apiStore} >
      <h1 > COVID-19 Cases Worldwide</h1>
      
        <WorldStats  />
        <CountrySelector />
        <CountryStats />
        <DataContext.Provider value={dataStore} >
          
          <StateSelector />
          
          <StateStats />
          <MyRegion />
          <CountyStats />
        </DataContext.Provider> 
        <Footer />
        
      </ApiContext.Provider>
      
    </div>
    )       
}

ReactDOM.render(<App />,app);



