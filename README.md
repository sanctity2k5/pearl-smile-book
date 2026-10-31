# PearlSmile Bookings

Design a complete appointment booking web app for a fictional Nigerian private dental clinic called **PearlSmile Dental**, located in **Lagos, Nigeria**.

The product should feel like a real modern private dental practice, not a generic SaaS template or hospital management system.

## Business context

PearlSmile Dental is a small private dental clinic with one dentist and a small support team.

Real-world quirks:

* Patients frequently contact the clinic asking, “Are you available today?”
* The clinic gets many appointment requests through phone calls and WhatsApp.
* Saturday appointments fill quickly.
* Some patients need same-day appointments for tooth pain or urgent dental issues.
* Appointments can run late when emergencies or walk-ins happen.
* Reception staff spend too much time manually confirming appointments and following up with patients.
* Last-minute rescheduling and no-shows are recurring problems.
* Certain appointments require a booking deposit.
* New patient appointments take longer than routine cleanings.

The product should solve this problem:

**Turn “I need to see a dentist. Are you available?” into “You’re booked.” with as little manual work from the clinic as possible.**

The focus is appointment booking and automated follow-through. Do not build a full dental practice management system.

## Visual design

Use a premium, warm clinical aesthetic.

Avoid the typical bright blue hospital/medical dashboard look.

Color direction:

* Warm ivory/off-white backgrounds
* Deep charcoal or navy text
* Muted teal as the primary accent
* Soft sage or blue-gray for secondary surfaces
* Very subtle warm gold accents

Typography:

* Clean modern sans-serif for most text
* Elegant but restrained headings
* Strong visual hierarchy
* Generous whitespace

UI:

* Spacious appointment cards
* Soft rounded corners
* Thin subtle borders
* Very light shadows
* Clear CTAs
* Minimal pill-shaped UI
* No excessive gradients
* No overly futuristic AI/SaaS styling

The customer-facing experience should feel like a premium private dental clinic website. The owner portal can be denser and more functional while keeping the same brand identity.

## CUSTOMER BOOKING FLOW

Create these screens:

### 1. Booking Landing Page

Header:
PearlSmile Dental

Location:
Lagos, Nigeria

Headline:
“Modern dental care, without the waiting room hassle.”

Supporting text:
“Choose a service, find a convenient time, and confirm your appointment in minutes.”

Primary CTA:
**Book an Appointment**

Secondary information:

* Same-day appointments available when slots are open
* Saturday appointments fill quickly
* Booking deposit may be required for selected appointments

Show a small selection of services:

* New Patient Consultation — 60 min
* Dental Cleaning — 60 min
* Cosmetic Consultation — 45 min
* Tooth Pain / Emergency — 30 min

Do not make this a large marketing website. Keep the focus on booking.

### 2. Select Appointment

Title:
“What can we help you with?”

Show large service cards with:

* Service name
* Short description
* Duration
* Price or deposit information where appropriate

Example:

New Patient Consultation
60 min
First visit and comprehensive dental assessment

Dental Cleaning
60 min
Routine professional cleaning and oral hygiene assessment

Cosmetic Consultation
45 min
Discuss cosmetic treatment options

Tooth Pain / Emergency
30 min
For urgent dental concerns when an emergency slot is available

Allow the patient to select one service.

### 3. Select Date & Time

Title:
“Find a time that works for you”

Show a clean calendar/date selector and available appointment slots.

Example:

Tuesday, October 6

10:30 AM
1:00 PM
4:30 PM

Make the interface clearly communicate unavailable and available times.

Important:
Appointment availability should respect the duration of the selected service.

Include:

* Previous/next date
* Available time slots
* “Today” option
* Clear selected state

For emergency appointments, make same-day availability prominent when available.

### 4. Patient Details

Title:
“Almost there”

Fields:

* Full name
* Phone number
* Email address

Optional:
“What brings you in?”

Options:

* New patient
* Routine cleaning
* Tooth pain
* Consultation
* Other

If the selected appointment requires a deposit, clearly show:

“₦10,000 booking deposit required to confirm this appointment.”

Use a simulated payment step rather than real payment processing.

Primary CTA:
**Confirm Appointment**

### 5. Booking Confirmation

Create a strong confirmation state.

Headline:

**You’re booked.**

Show:

PearlSmile Dental
Lagos, Nigeria

Tuesday, October 6
1:00 PM

New Patient Consultation

Include:

* Patient name
* Appointment duration
* Deposit status
* Clinic location

Confirmation message:

“Your appointment has been confirmed. We’ll send you a reminder before your visit.”

Buttons:
**Add to Calendar**
**Manage Appointment**

The confirmation page should feel reassuring and complete.

### 6. Manage Appointment

Allow the patient to view:

* Appointment date
* Time
* Service
* Clinic information
* Deposit status

Actions:
**Reschedule**
**Cancel Appointment**

When rescheduling, show available times instead of telling the patient to call the clinic.

## OWNER PORTAL

Create a separate owner/reception portal for PearlSmile Dental.

Include:

### 7. Owner Login

Minimal professional login screen.

PearlSmile Dental
Owner Portal

Fields:
Email
Password

CTA:
**Sign In**

Include:
Forgot password

This can be prototype/mock authentication.

### 8. Owner Dashboard

Headline:
“Good morning”

Show the current date.

Summary cards:

**Today’s Appointments**
8

**Confirmed**
7

**Needs Attention**
1

**Deposits Collected**
₦30,000

Show:

### Today’s Schedule

9:00 AM
Emily Carter
Dental Cleaning
Confirmed

10:30 AM
James Wilson
New Patient Consultation
Confirmed

1:00 PM
Sarah Miller
Cosmetic Consultation
Confirmed

3:00 PM
Michael Brown
Tooth Pain / Emergency
Needs Confirmation

Include a clear “Needs Attention” section.

Example:

**Michael Brown**
Appointment today at 3:00 PM

“Reminder sent. Patient has not confirmed.”

Action:
**Send Reminder**

Also show a small automation summary:

“6 appointment reminders are scheduled automatically.”

This should demonstrate that the clinic no longer needs to manually call every patient.

### 9. Appointment Details

Show a detailed appointment for:

James Wilson

New Patient Consultation
Tuesday, October 6 · 10:30 AM

Status:
**Confirmed**

Deposit:
**₦10,000 Paid**

Patient information:

* Name
* Phone
* Email

Actions:
**Reschedule**
**Cancel**
**Send Reminder**

Show an appointment activity timeline:

✓ Appointment requested
✓ Deposit received
✓ Appointment confirmed
✓ Confirmation sent
✓ Reminder scheduled

If “Send Reminder” is clicked, show a visible success state:

“Reminder sent successfully.”

### 10. Calendar

Create a clean weekly calendar for the clinic.

Business hours:
Monday–Saturday
9:00 AM–6:00 PM

Use appointment blocks sized according to appointment duration.

Show realistic appointments across the week.

Controls:

* Previous week
* Next week
* Today
* Day / Week view

Clicking an appointment should open its appointment details.

Use different subtle visual states for:

* Confirmed
* Needs confirmation
* Emergency
* Available

## PRODUCT BEHAVIOR

The prototype should communicate this workflow clearly:

Patient requests appointment
↓
Selects service
↓
Sees available time
↓
Provides details
↓
Confirms appointment
↓
Deposit recorded
↓
Appointment confirmed
↓
Confirmation sent
↓
Reminder automatically scheduled
↓
Owner only handles appointments that need attention

Use realistic mock data throughout.

Do not add:

* Medical records
* Insurance management
* Prescriptions
* Treatment plans
* Payroll
* Inventory
* Staff management
* Complex analytics
* CRM
* Blog
* Reviews management
* Multiple locations
* Full payment infrastructure

The core experience is **booking + confirmation + automated follow-through**.

Make the final design polished, realistic, responsive, and presentation-ready. Prioritize the booking experience and the reduction of manual work for the clinic owner.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://pearl-smile-book.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/beb07b52-0afe-4baf-8829-b1be3a6c5002).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
