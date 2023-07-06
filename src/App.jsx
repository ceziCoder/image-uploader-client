import { useEffect, useState, useRef } from 'react'

import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'
import { PuffLoader, PacmanLoader, CircleLoader, ClockLoader } from 'react-spinners'
import { AiOutlineMinusCircle, AiOutlineFileSearch } from 'react-icons/ai'
import { BsCloudUpload } from 'react-icons/bs'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Canvas from './components/Canvas'
import Swal from 'sweetalert2'
import basco2Logo from './public/basco2_logo.svg'


export default function App() {
	const [image, setImage] = useState(null)
	const [imageUrl, setImageUrl] = useState(null)
	const serverPublic = import.meta.env.VITE_REACT_APP_PUBLIC_FOLDER
	const [images, setImages] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	// handle Image Change
	const onImageChange = (event) => {
		if (event.target.files && event.target.files[0]) {
			let img = event.target.files[0]
			setImage(img)
			setImageUrl(URL.createObjectURL(img))
		}
	}
	const remoteServer = 'https://image-uploader-server-lqfb.onrender.com'
	const localServer = 'http://localhost:3000'

	const fetchImages = async () => {
		try {
			const response = await axios.get('http://localhost:3000/public')

			if (response.status !== 200) {
				throw new Error('Network response was not OK')
			}
			console.log(response.data)

			const images = response.data.map((image) => ({
				fileName: image.fileName,
				content: `data:${image.mimeType};base64,${image.content}`,
			}))

			setImages([...images])
	
		} catch (error) {
			console.error(error)
		}
	}

	// upload image to server and load new file
	const uploadImage = async (e) => {
		e.preventDefault()

		setIsLoading(true)
		const formData = new FormData()
		formData.append('image', image)

		try {
			const response = await axios.post('http://localhost:3000/single', formData)
			if (response.status !== 200) {
				throw new Error('Network response was not OK')
			}

			console.log(response.data)
			const imageUrl = response.data.url
			setImageUrl(imageUrl)

			setTimeout(() => {
				fetchImages()
				setIsLoading(false)
			}, 1000)
		} catch (error) {
			console.error(error)
		}
	}

	///// load files from server
	useEffect(() => {
		fetchImages()
		// start interval to refresh images
		
		const interval = setInterval(() => {
			fetchImages()
		}, 5000)

		// clear interval when component unmounts
		return () => {
			clearInterval(interval)
		}
	}, [])

	const convertBinaryToUrl = (binaryData) => {
		const blob = new Blob([binaryData], { type: 'image/*' })
		const url = URL.createObjectURL(blob)
		return url
	}

	/////// delete single file

	const handleDelete = async (fileName) => {
		try {
			await axios.delete(`http://localhost:3000/single/${fileName}`)

			Swal.fire({
				title: 'image deleted',
				showClass: {
					popup: 'animate__animated animate__fadeInDown',
				},
				hideClass: {
					popup: 'animate__animated animate__fadeOutUp',
				},
			})
			// Refresh images after deletion ////
			setTimeout(fetchImages, 3000)
		
		} catch (error) {
			console.error(error)
		}
	}
	const settings = {
		arrows: true,
		speed: 200,
		dots: true,
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 10000,
		centerPadding: '0px',
		centerMode: true,
		className: 'center',
		lazyLoad: true,

		initialSlide: 1,
		pauseOnHover: true,

		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
					centerPadding: '10px',
					lazyLoad: true,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					initialSlide: 1,
					dots: false,
					centerPadding: '1px',
					centerMode: true,
					arrows: false,
					lazyLoad: true,
				},
			},
			{
				breakpoint: 480,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					dots: false,
					centerPadding: '40px',
					arrows: false,
					centerMode: true,
					lazyLoad: true,
				},
			},
		],
	}

	return (
		<div
			className='h-full w-full flex flex-col  justify-center items-center    fixed     bg-gradient-to-r from-white/50 to-violet-100        '
			id='app'>
			<div className='absolute h-[50px] w-[100px] sm:top-[30px] sm:left-[150px] left-[30px]  top-[40px] sm:h-[100px] sm:w-[200px] bg-blue-100 rounded-lg shadow-lg shadow-sky-200 sm:p-4 p-2  object-center'>
				<img  src={basco2Logo} alt='Basco2 Logo' />
			</div>
			<div className='absolute top-[290px] left-50  h-[400px] w-[500px] bg-cyan-200 md:bg-blue-300   blur-3xl  ' />
			<div className='  absolute top-[180px] left-[120px] h-[500px] w-[400px]  lg:bg-blue-400 blur-3xl  ' />
			<div className='absolute top-[180px] right-[130px]  h-[500px] w-[400px] lg:bg-blue-400  blur-3xl  ' />

			<div className=' flex justify-center items-center  mt-6'>
				<form
					className='flex flex-col justify-center items-center  '
					action='/single'
					method='POST'
					enctype='multipart/form-data'>
					<label className='m-4 cursor-pointer bg-sky-200  rounded-md  p-2  shadow-lg shadow-black/80 scale-100 ease-in-out  duration-500  hover:bg-sky-400 hover:scale-110'>
						<AiOutlineFileSearch size={40} />
						<input
							className=' w-[30%] h-[30%] hidden'
							type='file'
							placeholder='room pic'
							accept='image/*'
							name='image'
							onChange={onImageChange}
							id='image'
						/>
					</label>

					<BsCloudUpload
						className=' bg-sky-200 cursor-pointer shadow-md rounded-full p-2 shadow-black w-[45%] h-[45%] scale-100 ease-in-out  duration-500  hover:bg-sky-400 hover:scale-110'
						onClick={uploadImage}
						type='submit'></BsCloudUpload>
				</form>
			</div>

			{isLoading ? (
				<div className='flex justify-center items-center m-4'>
					<PuffLoader color='black' size={50} />
				</div>
			) : (
				<div className='justify-center items-center flex flex-col m-4 rounded-xl image-container'>
					{imageUrl && <img className='h-[90px] w-[90px]' src={imageUrl} alt='Obraz' />}
				</div>
			)}
			{!images.length > 3 ? (
				<div className='flex justify-center items-center m-4'>
					<ClockLoader color='#2c0725' size={50} />
				</div>
			) : (
				<div className=' h-[600px] w-[500px] lg:h-[1400px] lg:w-[1400px]    rounded-xl mb-8  ' id='slider'>
					<Slider className=' ' {...settings}>
						{images.map((image) => (
							<div className='   ' key={image.fileName}>
								{images.length > 3 && (
									<AiOutlineMinusCircle
										className='absolute top-[8%]  ml-14 rounded-full bg-sky-300     w-6 h-6  shadow-black  shadow-lg cursor-pointer hover:bg-sky-400
										scale-100 ease-in-out  duration-500 hover:scale-125  '
										onClick={() => handleDelete(image.fileName)}
									/>
								)}

								<img
									id=''
									className='  
									bg-pink-800/10 
									h-[400px] w-[400px] 
									  rounded-xl shadow-lg  object-center  shadow-white/50  lg:ml-12 lg:mb-8 lg:mt-8  p-10 m-auto p-auto '
									src={image.content}
									alt='Gallery Image'
								/>
							</div>
						))}
					</Slider>
				</div>
			)}
		</div>
	)
}
