-- Users Table
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(20),
    last_name VARCHAR(20),
    email VARCHAR(120) UNIQUE,
    email_verified TINYINT(1) DEFAULT 0,
    profile_image_url VARCHAR(500),
    password VARCHAR(255),
    birth_date DATE,
    phone_number VARCHAR(30),
    street VARCHAR(30),
    city VARCHAR(30),
    role ENUM('PATIENT','DONOR','DOCTOR','ADMIN') NOT NULL DEFAULT 'PATIENT',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Organizations Table
CREATE TABLE organizations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type ENUM('HOSPITAL','PHARMACY','CLINIC','LABORATORY','CHARITY','BLOOD_BANK','OTHER'),
    email VARCHAR(255),
    password VARCHAR(255),
    is_active TINYINT(1) DEFAULT 1,
    phone_number VARCHAR(50),
    profile_image_url VARCHAR(500),
    street VARCHAR(255),
    city VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE patients (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    insurance_number VARCHAR(100),
    medical_info VARCHAR(1000),
    is_verify TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_patients_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Doctors Table
CREATE TABLE doctors (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    specialization VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctors_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Donors Table
CREATE TABLE donors (
    user_id BIGINT UNSIGNED PRIMARY KEY,
    name VARCHAR(255),
    contact_info VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donors_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Doctor Appointments Table
CREATE TABLE doctor_appointments (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    doctor_id BIGINT UNSIGNED NOT NULL,
    start_time DATETIME,
    end_time DATETIME,
    category VARCHAR(100),
    additional_info VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctors (user_id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Reservations Table
CREATE TABLE reservations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT UNSIGNED NOT NULL,
    doctor_appointment_id BIGINT UNSIGNED,
    pref VARCHAR(255),
    status ENUM('PENDING','CONFIRMED','COMPLETED','CANCELED'),
    start_time DATETIME,
    end_time DATETIME,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_reservation_patient FOREIGN KEY (patient_id)
        REFERENCES patients (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_reservation_appointment FOREIGN KEY (doctor_appointment_id)
        REFERENCES doctor_appointments (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Workshops Table
CREATE TABLE workshops (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    description VARCHAR(2000),
    type ENUM('HEALTH_EDUCATION','TRAINING','WEBINAR','ONLINE_COURSE','WORKSHOP','OTHER'),
    link VARCHAR(500),
    location VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Alerts Table
CREATE TABLE alerts (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(25),
    description VARCHAR(1000),
    type ENUM('GENERAL','EMERGENCY','HEALTH_TIP','EVENT','OTHER'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Health Guides Table
CREATE TABLE health_guides (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Health Guide Translations Table
CREATE TABLE health_guide_translations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    health_guide_id BIGINT UNSIGNED NOT NULL,
    category_en VARCHAR(255),
    category_ar VARCHAR(255),
    title_en VARCHAR(255),
    title_ar VARCHAR(255),
    content_en VARCHAR(3000),
    content_ar VARCHAR(3000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hgt_guide FOREIGN KEY (health_guide_id)
        REFERENCES health_guides (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Files Table
CREATE TABLE files (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT UNSIGNED NULL,
    guide_id BIGINT UNSIGNED NULL,
    doctor_id BIGINT UNSIGNED NULL,
    link VARCHAR(1000),
    type ENUM('PATIENT_RECORD','HEALTH_GUIDE','DOCTOR_CERTIFICATE','OTHER'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_files_patient FOREIGN KEY (patient_id)
        REFERENCES patients (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_files_guide FOREIGN KEY (guide_id)
        REFERENCES health_guides (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_files_doctor FOREIGN KEY (doctor_id)
        REFERENCES doctors (user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Anonymous Messages Table
CREATE TABLE anonymous_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    is_replay TINYINT(1) DEFAULT 0,
    replay_id BIGINT UNSIGNED,
    content VARCHAR(2000),
    asset_link VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_anonymous_replay FOREIGN KEY (replay_id)
        REFERENCES anonymous_messages (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Support Groups Table
CREATE TABLE support_groups (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(1000),
    category VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Group Members Table
CREATE TABLE group_member (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NOT NULL,
    role VARCHAR(100),
    status ENUM('ACTIVE','INACTIVE','BANNED'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_groupmember_group FOREIGN KEY (group_id)
        REFERENCES support_groups (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_groupmember_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Group Messages Table
CREATE TABLE group_messages (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    group_id BIGINT UNSIGNED NOT NULL,
    user_id BIGINT UNSIGNED NULL,
    message VARCHAR(2000),
    asset_link VARCHAR(1000),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_groupmessage_group FOREIGN KEY (group_id)
        REFERENCES support_groups (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_groupmessage_user FOREIGN KEY (user_id)
        REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Medical Needs Table
CREATE TABLE medical_needs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    description VARCHAR(2000),
    org_id BIGINT UNSIGNED,
    patient_id BIGINT UNSIGNED,
    is_request TINYINT(1) DEFAULT 0,
    price DECIMAL(12,2) DEFAULT 0.00,
    quantity INT DEFAULT 0,
    type ENUM('MEDICATION','EQUIPMENT','SUPPLIES','SURGERY','THERAPY','DIAGNOSTIC','CONSULTATION','OTHER') NOT NULL,
    status ENUM('PENDING','IN_PROGRESS','FULFILLED','CANCELED'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_medicalneed_org FOREIGN KEY (org_id)
        REFERENCES organizations (id) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_medicalneed_patient FOREIGN KEY (patient_id)
        REFERENCES patients (user_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- Donations Table
CREATE TABLE donations (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    donor_id BIGINT UNSIGNED,
    medical_need_id BIGINT UNSIGNED,
    amount DECIMAL(12,2) DEFAULT 0.00,
    status ENUM('SUCCESS','CANCELED','FAILED'),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_donations_donor FOREIGN KEY (donor_id)
        REFERENCES donors (user_id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_donations_medicalneed FOREIGN KEY (medical_need_id)
        REFERENCES medical_needs (id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Verification Codes Table
CREATE TABLE verification_codes (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    target_type ENUM('ORGANIZATION_REGISTER','VERIFY_PATIENT','RESET_PASSWORD','VERIFY_EMAIL','OTHER'),
    target_id BIGINT UNSIGNED,
    code VARCHAR(100),
    expires_at DATETIME,
    is_used TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
