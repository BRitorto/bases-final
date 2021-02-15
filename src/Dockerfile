FROM python:3.7-alpine
RUN apk add --no-cache gcc musl-dev linux-headers
COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt
RUN pip install -U flask-cors
EXPOSE 5000
WORKDIR /app
ADD . /app
CMD ["flask", "run", "--host", "0.0.0.0"]