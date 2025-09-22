"use client";

import React, { useState, FormEvent } from "react";
import Image from "next/image";
import "./loginSignup.css";

export type AuthMode = "signup" | "login";

const LoginSignup: React.FC = () => {
	const [mode, setMode] = useState<AuthMode>("signup");
	const [loading, setLoading] = useState(false);
	const [form, setForm] = useState({
		firstName: "",
		lastName: "",
		userName: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const title = mode === "signup" ? "Sign Up" : "Login";
	const apiUrl = "http://localhost:5002/api";

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (loading) return;
		setLoading(true);
		try {
			if (mode === "signup") {
				// password confirmation check
				if (form.password !== form.confirmPassword) {
					alert("Passwords do not match!");
					setLoading(false);
					return;
				}

				const res = await fetch(`${apiUrl}/register`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						firstName: form.firstName,
						lastName: form.lastName,
						username: form.userName,
						email: form.email,
						password: form.password,
						rePassword: form.confirmPassword,
					}),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.message);

				alert("You have successfully created your account!");
				window.location.href = "/dashboard";
			} else {
				const res = await fetch(`${apiUrl}/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						email: form.email,
						password: form.password,
					}),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.message);

				alert("Logged in successfully!");
				window.location.href = "/dashboard";
			}
		} catch (err: unknown) {
			if (err instanceof Error) {
				alert(err.message);
			} else {
				alert("An unexpected error occurred");
			}
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="auth-page">
			<div className="auth-container">
				<div className="auth-card">
					<div className="auth-header">
						<h1>{title}</h1>
						<div className="auth-underline" />
					</div>

					<form className="auth-form" onSubmit={handleSubmit}>
						{mode === "signup" && (
							<>
								<div className="input-wrapper">
									<span className="input-icon">
										<Image
											src="/icons/person.png"
											alt=""
											className="icon-img"
											width={32}
											height={32}
										/>
									</span>
									<input
										id="firstname"
										type="text"
										placeholder="First Name"
										autoComplete="given-name"
										value={form.firstName}
										onChange={(e) =>
											setForm({ ...form, firstName: e.target.value })
										}
										className="input-field"
									/>
								</div>

								<div className="input-wrapper">
									<span className="input-icon">
										<Image
											src="/icons/person.png"
											alt=""
											className="icon-img"
											width={32}
											height={32}
										/>
									</span>
									<input
										id="lastname"
										type="text"
										placeholder="Last Name"
										autoComplete="family-name"
										value={form.lastName}
										onChange={(e) =>
											setForm({ ...form, lastName: e.target.value })
										}
										className="input-field"
									/>
								</div>

								<div className="input-wrapper">
									<span className="input-icon">
										<Image
											src="/icons/person.png"
											alt=""
											className="icon-img"
											width={32}
											height={32}
										/>
									</span>
									<input
										id="username"
										type="text"
										placeholder="User Name"
										autoComplete="username"
										value={form.userName}
										onChange={(e) =>
											setForm({ ...form, userName: e.target.value })
										}
										className="input-field"
									/>
								</div>
							</>
						)}

						<div className="input-wrapper">
							<span className="input-icon">
								<Image
									src="/icons/mail.png"
									alt=""
									className="icon-img"
									width={32}
									height={32}
								/>
							</span>
							<input
								id="email"
								type="email"
								placeholder="Email"
								autoComplete="email"
								value={form.email}
								onChange={(e) => setForm({ ...form, email: e.target.value })}
								className="input-field"
							/>
						</div>

						<div className="input-wrapper">
							<span className="input-icon">
								<Image
									src="/icons/lock.png"
									alt=""
									className="icon-img"
									width={32}
									height={32}
								/>
							</span>
							<input
								id="password"
								type="password"
								placeholder="Password"
								autoComplete={
									mode === "signup" ? "new-password" : "current-password"
								}
								value={form.password}
								onChange={(e) => setForm({ ...form, password: e.target.value })}
								className="input-field"
							/>
						</div>

						<div className="input-wrapper">
							<span className="input-icon">
								<Image
									src="/icons/lock.png"
									alt=""
									className="icon-img"
									width={32}
									height={32}
								/>
							</span>
							<input
								id="confirmPassword"
								type="password"
								placeholder="Re-enter Password"
								autoComplete="new-password"
								value={form.confirmPassword}
								onChange={(e) =>
									setForm({ ...form, confirmPassword: e.target.value })
								}
								className="input-field"
							/>
						</div>

						<p className="auth-lost-password">
							Lost Password? <a href="#">Click Here!</a>
						</p>

						<div className="auth-buttons">
							<button
								type="submit"
								disabled={loading}
								className={mode === "signup" ? "primary-btn" : "secondary-btn"}
							>
								{loading ? "Working…" : title}
							</button>

							<button
								type="button"
								onClick={() => setMode(mode === "signup" ? "login" : "signup")}
								className={mode === "login" ? "primary-btn" : "secondary-btn"}
							>
								{mode === "signup" ? "Switch to Login" : "Switch to Sign Up"}
							</button>
						</div>
					</form>
				</div>

				<p className="auth-footer">
					By continuing you agree to our <a href="#">Terms</a> &{" "}
					<a href="#">Privacy Policy</a>.
				</p>
			</div>
		</div>
	);
};

export default LoginSignup;
