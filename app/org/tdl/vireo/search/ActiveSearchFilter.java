package org.tdl.vireo.search;

/**
 * An active search filter is designed to be able to live in the HTTP
 * environment. While this interfaces cousin the NamedSearchFilter is designed
 * to be persisted in a database.
 * 
 * To support this use case additional methods are provided to encode and decode
 * an active search filter so that it can be stored in a cookie or as an HTTP
 * parameter.
 * 
 * In addition for convenience copyTo and copyFrom methods have been added to
 * make it easy for an active search filter to be generated from a persisted
 * NamedSearchfilter in the database.
 * 
 * @author <a href="http://www.scottphillips.com">Scott Phillips</a>
 */
public interface ActiveSearchFilter extends SearchFilter {

	/**
	 * Generate a URI safe encoding of the current state of this search filter.
	 * It may be assumed that another search filter of the same implementation
	 * will be able to decode this string restoring the exact state of the
	 * search filter.
	 * 
	 * The current state of the filter is not modified by this operation.
	 * 
	 * @return A URI safe encoding of the search filter.
	 */
	public String encode();

	/**
	 * Set the current state of this search filter to that of the encoded
	 * filter. The filter used here should have been generated by another
	 * ActiveSearchFilter of the same implementation and will restore the state
	 * of that original filter.
	 * 
	 * The current state of this filter will be completely lost.
	 * 
	 * @param serialize
	 *            The encoded filter state
	 */
	public void decode(String serialize);

	/**
	 * Modify the state of the provided filter so that it matches the state of
	 * this filter exactly.
	 * 
	 * Note, the state of the other filter will be completely lost.
	 * 
	 * @param otherFilter
	 *            The filter to be modified.
	 */
	public void copyTo(SearchFilter otherFilter);

	/**
	 * Modiy the state of this search filter so that it copies the exact state
	 * of the other filter. The other filter will not be modified.
	 * 
	 * Note, the current state of this filter will be completely lost.
	 * 
	 * @param otherFilter
	 *            The filter to copy from.
	 */
	public void copyFrom(SearchFilter otherFilter);
}
