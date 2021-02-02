import React from 'react'

export default function OnlineTest(props) {
    const { detailTest, no } = props

    return (
        <tr>
            <td>{no + 1}. </td>
            <td>{detailTest.question}</td>
            <td>{detailTest.answer}</td>
            <td>{detailTest.value}</td>
        </tr>
    )
}
