import { useEffect, useState, useRef } from 'react'

import axios from 'axios'
import FormData from 'form-data'
import dotenv from 'dotenv'
import { PuffLoader } from 'react-spinners'
import { AiOutlineMinusCircle, AiOutlineFileSearch } from 'react-icons/ai'
import {  BsCloudUpload } from 'react-icons/bs'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Canvas from './components/Canvas'
import Swal from 'sweetalert2'

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

	const fetchImages = async () => {
		try {
			const response = await axios.get('https://image-uploader-server-lqfb.onrender.com/public')
			if (response.status !== 200) {
				throw new Error('Network response was not OK')
			}
			console.log(response.data)

			const images = response.data.map((image) => ({
				fileName: image.fileName,
				content: `data:${image.mimeType};base64,${image.content}`,
			}))

			setImages(images)
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
			const response = await axios.post('https://image-uploader-server-lqfb.onrender.com/single', formData)
			if (response.status !== 200) {
				throw new Error('Network response was not OK')
			}

			console.log(response.data)
			const imageUrl = response.data.url
			setImageUrl(imageUrl)

			setTimeout(() => {
				fetchImages()
				setIsLoading(false)
			}, 3000)
		} catch (error) {
			console.error(error)
		}
	}

	///// load files from server
	useEffect(() => {
		fetchImages()
	}, [])

	const convertBinaryToUrl = (binaryData) => {
		const blob = new Blob([binaryData], { type: 'image/*' })
		const url = URL.createObjectURL(blob)
		return url
	}

	/////// delete single file

	const handleDelete = async (fileName) => {
		try {
			await axios.delete(`https://image-uploader-server-lqfb.onrender.com/single/${fileName}`)

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
			fetchImages()
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
				},
			},
		],
	}

	return (
		<div
			className='h-full w-full flex flex-col  justify-center items-center    fixed     bg-gradient-to-r from-white/50 to-violet-100        '
			id='app'>
			<div className='absolute top-[290px] left-50  h-[400px] w-[500px] bg-pink-200 md:bg-pink-300   blur-3xl  ' />
			<div className='  absolute top-[180px] left-[120px] h-[500px] w-[400px]  lg:bg-violet-500 blur-3xl  ' />
			<div className='absolute top-[180px] right-[130px]  h-[500px] w-[400px] lg:bg-violet-500  blur-3xl  ' />

			<div className=' flex justify-center items-center  mt-6'>
				<form
					className='flex flex-col justify-center items-center  '
					action='/single'
					method='POST'
					enctype='multipart/form-data'>
					<label className='m-4 cursor-pointer bg-green-200  rounded-md  p-2  shadow-lg shadow-black/80 hover:bg-green-300 '>
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
						className=' bg-green-200 cursor-pointer shadow-md rounded-full p-2 shadow-black w-[45%] h-[45%] hover:bg-green-300 '
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
			<div className=' h-[600px] w-[500px] lg:h-[1400px] lg:w-[1400px]    rounded-xl mb-8  ' id='slider'>
				<Slider className=' ' {...settings}>
					{images.map((image) => (
						<div className='   ' key={image.id}>
							{images.length > 3 && (
								<AiOutlineMinusCircle
									className='absolute top-[8%]  ml-14 rounded-full bg-pink-500     w-6 h-6  shadow-white  shadow-sm cursor-pointer   '
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
		</div>
	)
}