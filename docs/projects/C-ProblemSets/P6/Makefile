CC = gcc
CFLAGS += -Wall -std=c99 -g
LDLIBS +=

# Default rule for building the driver program
all: driver

# Linking the driver executable
driver: driver.o input.o map.o value.o
	$(CC) -o $@ $^ $(LDLIBS)

# Rule to build the stringTest program
stringTest: stringTest.o value.o
	$(CC) -o $@ $^ $(LDLIBS)

# Rule to build the mapTest program
mapTest: mapTest.o map.o value.o
	$(CC) -o $@ $^ $(LDLIBS)

# Generic rule for building object files from C source files
%.o: %.c
	$(CC) $(CFLAGS) -c $<

# Clean rule to delete generated files
clean:
	rm -f driver stringTest mapTest *.o *.gcda *.gcno *.gcov

# Dependencies based on the project structure
input.o: input.c input.h
map.o: map.c map.h value.h
value.o: value.c value.h
driver.o: driver.c input.h map.h value.h
stringTest.o: stringTest.c value.h
mapTest.o: mapTest.c map.h value.h