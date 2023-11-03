import React from 'react'

function AboutUsPage() {

  const doctorImage1 = '/components/img/image11.png'
  const doctorImage2 = '/components/img/image12.png'
  const doctorImage3 = '/components/img/image13.png'

  return (
    <div className=' border border-red-500'>
      <h1 className=' text-4xl font-normal text-center p-7'>เกี่ยวกับเรา</h1>
      <div className=' flex flex-col space-y-4'>
        <h2 className=' text-2xl font-normal ml-14'>ทีมแพทย์</h2>
        <div className=' grid grid-cols-3 justify-items-center gap-5'>
          <div className=' border-4 border-black rounded-lg grid justify-items-center'>
            <img className='' src={doctorImage1} alt='แพทย์คนที่ 1'/>
            <span className=' text-xl font-normal'>แพทย์คนที่ 1</span>
          </div>
          <div className=' border-4 border-black rounded-lg grid justify-items-center'>
            <img className='' src={doctorImage2} alt='แพทย์คนที่ 2'/>
            <span className=' text-xl font-normal'>แพทย์คนที่ 2</span>
          </div>
          <div className=' border-4 border-black rounded-lg grid justify-items-center'>
            <img className='' src={doctorImage3} alt='แพทย์คนที่ 3'/>
            <span className=' text-xl font-normal'>แพทย์คนที่ 3</span>
          </div>
          <div className=' text-xl'>แพทย์คนที่ 4</div>
        </div>
      </div>
    </div>
  )
}

export default AboutUsPage