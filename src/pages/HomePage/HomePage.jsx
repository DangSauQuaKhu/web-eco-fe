import React from 'react'
import TypeProduct from '../../components/TypeProduct/TypeProduct'
import { WrapperButtonMore, WrapperTypeProduct } from './style'
import SliderComponent from '../../components/SliderComponent/SliderComponent'
import slider1 from '../../assets/images/slider1.webp'
import slider2 from '../../assets/images/slider2.webp'
import slider3 from '../../assets/images/slider3.webp'
import CardComponent from '../../components/CardComponent/CardComponent'
import { WrapperProducts } from '../TypeProductPage/style'
import { useQuery } from '@tanstack/react-query'
import * as ProductService from '../../services/ProductService'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { useRef } from 'react'
import { useState } from 'react'
import Loading from '../../components/LoadingComponent/LoadingComponent'
import { useDebounce } from '../../hooks/useDebounce'
import { useDebounceArray } from '../../hooks/useDebounceArray'
// import NavbarComponent from '../../components/NavbarComponent/NavbarComponent'
// import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'

const HomePage = () => {
  const searchProduct = useSelector((state) => state?.product?.search)
  const isImage = useSelector((state) => state?.product?.isImage)
  const productImgs = useSelector((state) => state?.product?.productImgs)

  const searchDebounce = useDebounce(searchProduct, 200)
  const searchImageDebounce = useDebounceArray(productImgs, 200)

  const refSearch = useRef()
  const [loading, setLoading] = useState(false)
  const [stateProducts, setStateProducts] = useState([])
  const [typeProducts, setTypeProducts] = useState([])
  const [limit, setLimit] = useState(5)

  const fetchProductAll = async (context) => {
    console.log('context', context)
    const limit = context?.queryKey && context?.queryKey[1]
    const search = context?.queryKey && context?.queryKey[2]
    const ids = context?.queryKey && context?.queryKey[3]
    if (isImage) {

      const res = await ProductService.getAllProductImage(ids, limit)
      return res
    }
    else {
      const res = await ProductService.getAllProduct(search, limit)
      return res
    }

  }
  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    if (res?.status === 'OK') {
      setTypeProducts(res?.data)
    }
  }
  const { isLoading, data: products, isPreviousData } = useQuery({ queryKey: ['products', limit, searchDebounce, searchImageDebounce], queryFn: fetchProductAll, retry: 3, retryDelay: 1000, keepPreviousData: true })
  // console.log('data', products)
  useEffect(() => {
    fetchAllTypeProduct()
  }, [])


  return (
    <>
      <Loading isLoading={isLoading || loading}>
        <div style={{ width: '1270px', margin: '0 auto' }}>
          <WrapperTypeProduct>
            {typeProducts.map((item) => {
              return (
                <TypeProduct name={item} key={item} />
              )
            })}
          </WrapperTypeProduct>
        </div>
        <div className='body' style={{ width: '100%', backgroundColor: '#efefef', }}>
          <div id="container" style={{ height: '1000px', width: '1050px', margin: '0 auto' }}>
            <SliderComponent arrImages={[slider1, slider2, slider3]} />

            <WrapperProducts>
              {products?.data?.map((product) => {
                return (
                  <CardComponent
                    key={product._id}
                    countInStock={product.countInStock}
                    description={product.description}
                    image={product.image}
                    name={product.name}
                    rating={product.rating}
                    price={product.price}
                    type={product.type}
                    selled={product.selled}
                    discount={product.discount}
                    id={product._id}
                  />
                )
              })}
            </WrapperProducts>


            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
              <WrapperButtonMore
                textbutton={isPreviousData ? 'Load more' : "Xem thêm"} type="outline" styleButton={{
                  border: '1px solid rgb(11, 116, 229)', color: `${products?.total === products?.data?.length ? '#ccc' : 'rgb(11, 116, 229)'}`,
                  width: '240px', height: '38px', borderRadius: '4px'
                }}
                disabled={products?.total === products?.data?.length || products?.totalPage === 1}
                styleTextButton={{ fontWeight: 500, color: products?.total === products?.data?.length && '#fff' }}
                onClick={() => setLimit((prev) => prev + 5)}
              />
            </div>

          </div>
        </div>
      </Loading>




    </>

  )
}

export default HomePage