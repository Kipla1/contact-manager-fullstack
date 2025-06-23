# Contact Management Application

A modern React-based contact management application that allows users to organize, filter, and manage their contacts with an intuitive interface.

![Contact Management App Screenshot](http://localhost:5173/)

## Features

- **Contact Management**: Add, edit, view, and delete contacts
- **Favorite Contacts**: Mark contacts as favorites for quick access
- **Block Contacts**: Ability to block unwanted contacts
- **Search Functionality**: Easily search through your contacts
- **Filter System**: Filter contacts by favorite or blocked status
- **Responsive Design**: Works well on both desktop and mobile devices
- **Real-time Notifications**: Get feedback when actions are completed

## Tech Stack

- **React**: Frontend library for building the user interface
- **React Router**: For navigation between different pages
- **Axios**: For making HTTP requests to the backend API
- **React Icons**: For beautiful and consistent iconography
- **React Modal**: For creating modal dialogs
- **JSON Server**: Lightweight mock backend for storing contact data

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Kipla1/contact-manager
   cd contact-management-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the JSON server (mock backend):
   ```bash
   npm json-server --watch contacts.json
   ```

4. In a new terminal, start the React development server:
   ```bash
   npm start
   ```

5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## Project Structure

```
contact-management-app/
├── public/
├── src/
│   ├── pages/
│   │   ├── AddContact.jsx
│   │   ├── ContactDetails.jsx
│   │   ├── ContactFilter.jsx
│   │   ├── ContactsListPage.jsx
│   │   ├── EditPage.jsx
│   │   ├── FavoriteContacts.jsx
│   │   ├── Intro.jsx
│   │   ├── Navbar.jsx
│   │   └── Searchbar.jsx
│   ├── App.css
│   ├── App.jsx
│   └── index.js
├── db.json
├── package.json
└── README.md
```

## Usage

### Adding a Contact

1. Click on the "Add New Contact" button
2. Fill in the contact details (name, email, phone)
3. Optionally mark as favorite or blocked
4. Click "Submit"

### Editing a Contact

1. Click on the edit icon next to a contact
2. Modify the details in the edit form
3. Click "Save Changes"

### Managing Contacts

- **View Details**: Click on a contact card to see full details
- **Delete**: Click the delete icon to remove a contact
- **Block/Unblock**: Toggle the block status with the block icon
- **Favorite/Unfavorite**: Toggle favorite status in the contact details view

### Filtering Contacts

Use the filter dropdown to view:
- All contacts
- Favorite contacts
- Blocked contacts

### Searching Contacts

Use the search bar to find contacts by name

## API Endpoints

The application uses the following API endpoints:

- `GET /contacts`: Fetch all contacts
- `GET /contacts/:id`: Fetch a specific contact
- `POST /contacts`: Add a new contact
- `PUT /contacts/:id`: Update a contact
- `PATCH /contacts/:id`: Partially update a contact
- `DELETE /contacts/:id`: Delete a contact

## Customization

The application uses a pleasant color scheme with:
- Primary color: `#457b9d` (Blue)
- Background color: `#ffe5ec` (Light Pink)
- Accent colors: `#ff6b6b` (Red) for actions

You can customize these colors in the `App.css` file.

## Contributors

Thanks to all the wonderful people who have contributed to this project:
  1. [Fabian Mbatha] (https://github.com/Sqwoze)
  2. [Jennifer Wanjiru] (https://github.com/JENNIFER754-DEL)
  3. [Brandon Omondi] (https://github.com/Brandon864)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [React Icons](https://react-icons.github.io/react-icons/) for the icon set
- [JSON Server](https://github.com/typicode/json-server) for the mock backend
- [React Modal](https://github.com/reactjs/react-modal) for modal functionality