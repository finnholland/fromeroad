const AboutDiv = () => {
  return (
    <div className='aboutDiv'>
      <div className='titleDiv'>
        <p className='sectionTitle'>about</p>
        <hr className='line' />
      </div>
      <span className='aboutText'>
        frome_road is a space for all employees of Lot Fourteen to discuss anything from tech to the weather.
      </span>
      <span className='aboutText'>
        The site is currently only available to employees of Chamonix.
      </span>
      <div className='titleDiv' style={{marginTop: '2rem'}}>
        <p className='sectionTitle'>creator</p>
        <hr className='line' />
      </div>
      <p className='aboutText' style={{marginTop: 0}}>I originally created this project as a way to get into full-stack devving.</p>
      <p className='aboutText'>The project stack is ReactJS, NodeJS, and MySQL, hosted on AWS Amplify with a dedicated server on Docker.</p>
      <p className='aboutText'>I honestly have no idea if it'll work or how many bugs there'll be so please don't hesitate to report them.</p>
      <p className='aboutText'>You can access the repo once logged in and verified :)</p>
    </div>
  );
}

export default AboutDiv