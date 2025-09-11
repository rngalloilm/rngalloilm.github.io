CC = gcc
CFLAGS = -Wall -std=c99 -g

trader: trader.o transaction.o account.o util.o
	gcc trader.o transaction.o account.o util.o -o trader

trader.o: trader.c transaction.h account.h util.h
	gcc -Wall -std=c99 -c trader.c

transaction.o: transaction.c transaction.h account.h util.h
	gcc -Wall -std=c99 -c transaction.c

account.o: account.c account.h util.h
	gcc -Wall -std=c99 -c account.c

util.o: util.c util.h
	gcc -Wall -std=c99 -c util.c