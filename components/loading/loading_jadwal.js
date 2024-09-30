import React from 'react'
import Logo from '../logo'
import Skeleton from 'react-loading-skeleton'

export default function LoadingJadwal() {
    return (
        <>
            {[...Array(5)].map((item, index) => (
                < tr key={index} >
                    <td>
                        {<Skeleton width={50} />}
                    </td>
                    <td>
                        {<Skeleton width={50} />}
                    </td>
                </ tr >
            ))}
        </>
    )
}