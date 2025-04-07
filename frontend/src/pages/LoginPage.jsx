import React, { useState } from 'react'

import { useAuthStore } from '../store/useAuthStore';
import {  EyeIcon, EyeOffIcon, Loader2,  LockIcon,  MailIcon, MessageSquareIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';

const LoginPage = () => {
  
  const [showPassword , setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email:"",
    password: "",
  });

  const {login , isLoggingIn } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData)

  }

  return (
    <div className='min-h-screen grid lg:grid-cols-2'>
      {/*left side */}
      <div className='flex flex-col justify-center items-center p-6 sm:p-12'>

        <div className='w-full max-w-md space-y-8'>
          {/* LOGO */}
          <div className='text-center mb-8'>
            <div className="flex flex-col items-center gap-2 group">
              <div
                className="size-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"
              >
                <MessageSquareIcon className='size-6 text-primary' />
              </div>
              <h1 className='text-2xl font-bold mt-2'>Welcome Back</h1>
              <p className="text-base-content/60">Sing in to your account</p>
            </div>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit} className='"space-y-6' >
            {/* Email section */}
            <div className="form-control py-3">
              <label className="label">
                <span className="label-text font-medium">Email</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  className={`input input-bordered w-full pl-10`}
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MailIcon className="size-5 text-base-content/40" />
                </div>
              </div>
            </div>
            {/* Password section */}
            <div className='form-control py-3'>
              <label className='label'>
                <span className='label-text font-medium'>Password</span>
              </label>
              <div className='relative'>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`input input-bordered  w-full pl-10`}
                  placeholder='•••••••••••'
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                  <LockIcon className='size-5 text-base-content/40' />
                </div>
                <button
                  type='button'
                  className='absolute  inset-y-0 right-0 pr-3 flex items-center'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className='size-5 text-base-content/40' />
                  ) : (
                    <EyeIcon className='size-5 text-base-content/40' />
                  )}
                </button>
              </div>
            </div>
            <button type='submit' className='btn btn-primary w-full' disabled={isLoggingIn}>
              {isLoggingIn ? (
                <>
                  <Loader2 className='size-5 animate-spin' />
                  Loading...
                </>
              ) : (
                "Sing in"
              )}
            </button>

          </form>
          <div className='text-center'>
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/signup" className='link link-primary'>
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Pattern */}
      <AuthImagePattern
        title={"Welcome back!"}
        subtitle={"Sign in to continue your conversations and catch up with your messages."}
      />

    </div>
  )
}

export default LoginPage