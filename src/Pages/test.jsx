import React from 'react'

const test = () => {
  return (
    <div>
    

<div class="h-full bg-gray-400 dark:bg-gray-900">
	<div class="mx-auto">
		<div class="flex justify-center px-6 py-12">
			<div class="w-full xl:w-3/4 lg:w-11/12 flex">
				
				<div class="w-full lg:w-7/12 bg-white dark:bg-gray-700 p-5 rounded-lg lg:rounded-l-none">
					<h3 class="py-4 text-2xl text-center text-gray-800 dark:text-white">Create an Account!</h3>
					<form onSubmit={handleSubmit} class="px-8 pt-6 pb-8 mb-4 bg-white dark:bg-gray-800 rounded">
						
						<div class="mb-4 md:flex md:justify-around">
                        div class="md:ml-2">
								<label class="block mb-2 text-sm font-bold text-gray-700 dark:text-white" for="lastName">
                                   FullName
                                </label>
								<input
                                value={formData.name}
                                onChange={handleChange}
                                required
                                    class="w-full px-3 py-2 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="UserName"
                                    type="text"
                                    placeholder="UserName"
                                />
							</div>
							<div class="mb-4 md:mr-2 md:mb-0">
								<label class="block mb-2 text-sm font-bold text-gray-700 dark:text-white" for="email">
									Email
								</label>
								<input
                                value={formData.email}
                                onChange={handleChange}
                                required
									class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
									id="email"
									type="email"
									placeholder="Email"
								/>
							</div>
							
						</div>
						<div class="mb-4 md:flex md:justify-around">
							<div class="mb-4 md:mr-2 md:mb-0">
								<label class="block mb-2 text-sm font-bold text-gray-700 dark:text-white" for="password">
                                    Password
                                </label>
								<input
                                type="password"
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border border-red-500 rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="password"
                                    type="password"
                                    placeholder="******************"
                                />
								<p class="text-xs italic text-red-500">Please choose a password.</p>
							</div>
							<div class="md:ml-2">
								<label 
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required class="block mb-2 text-sm font-bold text-gray-700 dark:text-white" for="c_password">
                                    Confirm Password
                                </label>
								<input
                                    class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                    id="c_password"
                                    type="password"
                                    placeholder="******************"
                                />
							</div>
						</div>
						<div class="mb-4 lg:ml-5  md:ml-[90px]">
							<label class=" block mb-2 text-sm font-bold text-gray-700 dark:text-white" for="Phone">
                                Phone
                            </label>
							<input value={formData.phone}
          onChange={handleChange}
                                class="w-full px-3 py-2 mb-3 text-sm leading-tight text-gray-700 dark:text-white border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                                id="Phone"
                                type="number"
                                placeholder="Enter your expected Job title"
                            />
						</div>
                        <input
          type="text"
          name="longitude"
          placeholder="Longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange} required>
          <option value="Client">Client</option>
          <option value="Service Client">Service Client</option>
          <option value="Worker">Worker</option>
        </select>
						<
							<button
                                class="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:text-white dark:hover:bg-blue-900 focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Register Account
                            </button>
						</div>
						<hr class="mb-6 border-t" />
						<div class="text-center">
							<a class="inline-block text-sm text-blue-500 dark:text-blue-500 align-baseline hover:text-blue-800"
								href="/login">
								Already have an account? Login!
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
</div>
    </div>
  )
}

export default test
