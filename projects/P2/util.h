/**
 * Header file for the util component. Functions processing 
 * and manupulating strings. Can be used by any component.
*/

/** Maximum length of any field in the input. */
#define FIELD_MAX 30

/**
 * Given a string and a starting index in the string. Finds the index of the 
 * next character that’s not a digit. Helps check the format of the date and the SSN fields.
 * @param str Input string
 * @param start Starting index of the string
 * @return Index of the next non-digit character
*/
int skip_digits( char str[], int start );

/**
 * Given a string and a starting index in the string. Finds the index of the 
 * next character that’s not a letter. Useful in processing the parts of a name.
 * @param str Input string
 * @param start Starting index of the string
 * @return Index of the next non-letter character
 * 
*/
int skip_letters( char str[], int start );

/**
 * Copies all the characters from sstart index in src up 
 * to (but not including) the send index.
 * @param dest Modified string, recieves the modification
 * @param dstart Index starting the point of modification
 * @param src String getting pulled from
 * @param sstart Index of first character being pull
 * @param send Index of last character, wont get pulled
 * @return Index of the null terminator added at the end of dest (modified str)
*/
int copy_substring( char dest[], int dstart, char src[], int sstart, int send );