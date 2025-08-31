CC = gcc
CFLAGS = -Wall -std=c99 -g

all: encrypt decrypt DESTest

encrypt: encrypt.o DES.o io.o
	$(CC) -o encrypt encrypt.o DES.o io.o DESMagic.o

decrypt: decrypt.o DES.o io.o
	$(CC) -o decrypt decrypt.o DES.o io.o DESMagic.o

DESTest: DESTest.o DES.o DESMagic.o
	$(CC) -o DESTest DESTest.o DES.o DESMagic.o

DESTest.o: DESTest.c DES.h DESMagic.h
	$(CC) $(CFLAGS) -c DESTest.c

encrypt.o: encrypt.c io.h DES.h
	$(CC) $(CFLAGS) -c encrypt.c

decrypt.o: decrypt.c io.h DES.h
	$(CC) $(CFLAGS) -c decrypt.c

io.o: io.c io.h DES.h
	$(CC) $(CFLAGS) -c io.c

DES.o: DES.c DES.h DESMagic.h
	$(CC) $(CFLAGS) -c DES.c

DESMagic.o: DESMagic.c DESMagic.h
	$(CC) $(CFLAGS) -c DESMagic.c