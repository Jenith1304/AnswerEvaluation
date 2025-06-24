import React from 'react'

export default function Button({ Icon, title, ...rest }) {
    return (
        <div>
            <button className="btn btn-primary" {...rest}>
                {Icon} {title}
            </button>
        </div>
    )
}
