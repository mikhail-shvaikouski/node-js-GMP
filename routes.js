const users = require('./users');

const handleRequest = (req, res) => {
  const urlReq = req.url;
  const method = req.method;

  const error = (code, message) => {
    res.writeHead(code, { 'Content-Type': 'text/plain' });
    res.end(message);
  }
  
  const output = (code, data) => {
    const responseData = JSON.stringify(data);
    const etag = require('crypto').createHash('md5').update(responseData).digest('hex');

    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304);
      res.end();
    } else {
      res.setHeader('ETag', etag);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(responseData);
    }
  }

  if (urlReq === '/users' && method === 'GET') { // Handle GET request to retrieve a list of users
    const usersData = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
    }));

    output(200, usersData)

  } else if (urlReq.match(/^\/users\/\d+$/) && method === 'GET') { // Handle GET request to retrieve a user by ID
    const userId = parseInt(urlReq.split('/').pop(), 10);
    const user = users.find(user => user.id === userId);

    if (user) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      output(200, userData)
    } else {
      error(404, 'User not found')
    }
  
  } else if (urlReq === '/users' && method === 'POST') { // Handle POST request to create a new user
    let body = '';

    req.on('data', chunk => {
      body += chunk;
    });

    req.on('end', () => {
      try {
        const userData = JSON.parse(body);
        console.log('userData', userData)
        const newUserId = users.length + 1;
        const newUser = {
          id: newUserId,
          name: userData.name,
          email: userData.email,
          hobbies: userData.hobbies,
        };

        users.push(newUser);

        output(201, newUser)
      } catch (error) {
        error(400, 'Invalid request data')
      }
    });

  } else if (urlReq.match(/^\/users\/\d+$/) && method === 'DELETE') { // Handle DELETE request to delete a user by ID
    const userId = parseInt(urlReq.split('/').pop(), 10);
    const userIndex = users.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
      users.splice(userIndex, 1);

      output(204)
    } else {
      error(404, 'User not found')
    }

  } else if (urlReq.match(/^\/users\/\d+$/) && method === 'PATCH') { // Handle PATCH request to partially update user properties by ID
    const userId = parseInt(urlReq.split('/').pop(), 10);
    const user = users.find(user => user.id === userId);

    if (user) {
      let body = '';

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const userData = JSON.parse(body);

          if (userData.name) {
            user.name = userData.name;
          }

          if (userData.email) {
            user.email = userData.email;
          }

          if (userData.hobbies) {
            user.hobbies = userData.hobbies;
          }

          output(200, user)
        } catch (error) {
          error(400, 'Invalid request data')
        }
      });
    } else {
      error(404, 'User not found')
    }
    
  } else if (urlReq.match(/^\/users\/\d+\/hobbies$/) && method === 'GET') { // Handle GET request to get a list of user hobbies by ID
    const userId = parseInt(urlReq.split('/')[2], 10);
    const user = users.find(user => user.id === userId);

    if (user) {
      output(200, user.hobbies)
    } else {
      error(404, 'User not found')
    }

  } else if (urlReq.match(/^\/users\/\d+\/hobbies$/) && method === 'POST') { // Handle POST request to add a hobby for a specific user by ID
    const userId = parseInt(urlReq.split('/')[2], 10);
    const user = users.find(user => user.id === userId);

    if (user) {
      let body = '';

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const hobbyData = JSON.parse(body);
          user.hobbies.push(hobbyData.hobby);

          output(201, user)
        } catch (error) {
          error(400, 'Invalid request data')
        }
      });
    } else {
      error(404, 'User not found')
    }

  } else if (urlReq.match(/^\/users\/\d+\/hobbies$/) && method === 'DELETE') { // Handle DELETE request to delete a hobby for a specific user by ID
    const userId = parseInt(urlReq.split('/')[2], 10);
    const user = users.find(user => user.id === userId);

    if (user) {
      let body = '';

      req.on('data', chunk => {
        body += chunk;
      });

      req.on('end', () => {
        try {
          const hobbyData = JSON.parse(body);
          const hobbyIndex = user.hobbies.indexOf(hobbyData.hobby);
          if (hobbyIndex !== -1) {
            user.hobbies.splice(hobbyIndex, 1);
            output(204)
          } else {
            error(404, 'Hobby not found')
          }
        } catch (error) {
          error(400, 'Invalid request data')
        }
      });
    } else {
      error(404, 'User not found')
    }
    
  } else {
    error(404, 'Not Found')
  }
}

module.exports = { handleRequest };
