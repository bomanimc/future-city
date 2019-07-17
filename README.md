# Future City

During a 7-day IDEO CoLab Fellowship, my team and I designed and prototyped Future City, an on-site augmented reality pop-up that invites residents to redesign a public space.

[See IDEO CoLab's brief video about this project here](https://www.youtube.com/watch?v=JqJ5CHC6ZGU).

- **Tools**: [Three.js](https://threejs.org/), [TopCodes](https://github.com/TIDAL-Lab/TopCodes).
- **Role**: Design Collaborator and Prototype Developer. In collaboration with [Harrison Lin](https://harrisonlin.com/), [Nicole Aw](https://www.nicoleaw.com/), and John Oustedyn.

## Context
We built Future City because we wanted to invite residents into the design process of public spaces. Future City is meant to allow for collaboration between city planners and local residents and to facilitate conversations between both parties when it comes to developing a shared vision for a new space in the city.

To prototype this concept, we created the following assets:

- A "game board" with physical pieces (3D printed & laser cut) with TopCodes attached. When the TopCodes are placed into the view of the webcam, an associated 3D object is displayed on the screen.
- Mock-up of the futurecity.com website and the dashboard that city planners would use to make decisions based on community designs.
- Posters to show process flow & AR viewer that is meant to show the AR view of how the landscape will look like after the shared vision is applied.

## Technology

The software prototype uses [TopCodes](https://github.com/TIDAL-Lab/TopCodes) to associate each game piece with a specific 3D object. The TopCodes JS library returns the x/y-coordinates of each TopCode it identifies in a video stream, and my custom software maps the position of each TopCode to the position of its 3D object in the virtual space. For our prototype, we made changes to the x-coordinate of the TopCode correspond to the horizontal positioning (x-axis) of the 3D object in the space. TopCode y-coordinate changes change the scale of the 3D object to simulate a change in perspective sizing. The Three.js library was used for loading and manipulating 3D objects.

