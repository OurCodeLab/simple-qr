import React from 'react'
import PropTypes from 'prop-types'

function classes(...xs) {
  return xs.filter(Boolean).join(' ')
}

export default function Button({ children, variant = 'primary', size = 'md', as = 'button', href, className, icon: Icon, ...props }) {
  const base = 'inline-flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 uppercase tracking-widest'

  const variants = {
    primary: 'bg-white text-hd-black hover:bg-hd-black hover:text-white border-2 border-hd-black focus:ring-hd-black transition-all duration-500 ease-in-out',
    secondary: 'bg-transparent border-2 border-hd-black text-hd-black hover:bg-white hover:text-hd-black focus:ring-hd-black transition-all duration-500 ease-in-out',
    ghost: 'bg-transparent text-hd-black hover:bg-hd-gray-100 focus:ring-hd-black transition-all duration-300',
  }

  const sizes = {
    sm: 'px-6 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-12 py-4 text-sm',
  }

  const Comp = as === 'a' || href ? 'a' : 'button'

  const content = (
    <>
      {Icon ? <Icon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> : null}
      <span>{children}</span>
    </>
  )

  const allClasses = classes(base, variants[variant], sizes[size], className)

  if (Comp === 'a') {
    return (
      <a href={href} className={allClasses} {...props}>
        {content}
      </a>
    )
  }

  return (
    <button className={allClasses} type="button" {...props}>
      {content}
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  as: PropTypes.oneOf(['button', 'a']),
  href: PropTypes.string,
  className: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.object]),
}
