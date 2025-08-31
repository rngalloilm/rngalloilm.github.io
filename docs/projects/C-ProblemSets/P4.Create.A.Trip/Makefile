CC = gcc
CFLAGS = -Wall -std=c99 -g -D_GNU_SOURCE

parks: parks.o catalog.o input.o
	$(CC) parks.o catalog.o input.o -o parks -lm

parks.o: parks.c catalog.h input.h
	$(CC) $(CFLAGS) -c parks.c

catalog.o: catalog.c catalog.h input.h
	$(CC) $(CFLAGS) -c catalog.c

input.o: input.c input.h
	$(CC) $(CFLAGS) -c input.c