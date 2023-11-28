exports.res200 = (res, data, message = 'SUCCESS') => {
  const response = { status: 200, message, data };
  res.status(200);
  res.json(response);
  res.end();
};

exports.res201 = (res, data, message = 'CREATED') => {
  const response = { status: 201, message, data };
  res.status(201);
  res.json(response);
  res.end();
};

exports.res400 = (res, data, message = 'BAD REQUEST') => {
  const response = { status: 400, message, data };
  res.status(400);
  res.json(response);
  res.end();
};

exports.res401 = (res, data, message = 'UNAUTHORIZED') => {
  const response = { status: 401, message, data };
  res.status(401);
  res.json(response);
  res.end();
};

exports.res403 = (res, data, message = 'FORBIDDEN') => {
  const response = { status: 401, message, data };
  res.status(401);
  res.json(response);
  res.end();
};

exports.res404 = (res, data, message = 'NOT FOUND') => {
  const response = { status: 404, message, data };
  res.status(404);
  res.json(response);
  res.end();
};

exports.res500 = (res, data, message = 'SERVER ERROR') => {
  const response = { status: 500, message, data };
  res.status(500);
  res.json(response);
  res.end();
};
