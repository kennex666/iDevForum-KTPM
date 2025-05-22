import { useUser } from '@/context/UserContext';
import React from 'react';

const Navbar = ({user}) => {
  return (
		<nav className="navbar navbar-expand bg-white shadow mb-4 topbar">
			<div className="container-fluid">
				<button
					className="btn btn-link d-md-none rounded-circle me-3"
					id="sidebarToggleTop"
					type="button"
				>
					<i className="fas fa-bars"></i>
				</button>
				<form className="d-none d-sm-inline-block me-auto ms-md-3 my-2 my-md-0 mw-100 navbar-search">
					<div className="input-group">
						<input
							className="bg-light form-control border-0 small"
							type="text"
							placeholder="Search for ..."
						/>
						<button className="btn btn-primary py-0" type="button">
							<i className="fas fa-search"></i>
						</button>
					</div>
				</form>
				<ul className="navbar-nav flex-nowrap ms-auto">
					<li className="nav-item dropdown d-sm-none no-arrow">
						<a
							className="dropdown-toggle nav-link"
							aria-expanded="false"
							data-bs-toggle="dropdown"
							href="#"
						>
							<i className="fas fa-search"></i>
						</a>
					</li>
					<li className="nav-item dropdown no-arrow mx-1">
						<a
							className="dropdown-toggle nav-link"
							aria-expanded="false"
							data-bs-toggle="dropdown"
							href="#"
						>
							<span className="badge bg-danger badge-counter">
								3+
							</span>
							<i className="fas fa-bell fa-fw"></i>
						</a>
					</li>
					<li className="nav-item dropdown no-arrow mx-1">
						<a
							className="dropdown-toggle nav-link"
							aria-expanded="false"
							data-bs-toggle="dropdown"
							href="#"
						>
							<span className="badge bg-danger badge-counter">
								7
							</span>
							<i className="fas fa-envelope fa-fw"></i>
						</a>
					</li>
					<div className="d-none d-sm-block topbar-divider"></div>
					<li className="nav-item dropdown no-arrow">
						<a
							className="dropdown-toggle nav-link"
							aria-expanded="false"
							data-bs-toggle="dropdown"
							href="#"
						>
							<span className="d-none d-lg-inline me-2 text-gray-600 small">
								{user.name || "Unknown"}
							</span>
							<img
								className="border rounded-circle img-profile"
								src={
									user.profilePicture ||
									"/assets/img/avt-default.png"
								}
								alt="profile"
							/>
						</a>
					</li>
				</ul>
			</div>
		</nav>
  );
};

export default Navbar;