var arrayUtil = {

	/**
	 * Inserts the element to the array. Assuming array is already sorted by the
	 * sortFunction.
	 */
	binaryInsert : function(element, array, sortFunction) {
		array.splice(arrayUtil.locationOf(element, array, sortFunction) + 1, 0, element);
		return array;
	},

	/**
	 * Returns the index of the element to be inserted into the sorted array.
	 * Assuming the array is already sorted by the sortFunction.
	 */
	locationOf : function(element, array, sortFunction, start, end) {
		sortFunction = sortFunction || function(left, right) {
			return left - right;
		};
		if (array.length > 0) {
			if (sortFunction(element, array[0]) < 0) {
				return -1;
			}
		}
		start = start || 0;
		end = end || array.length;
		var pivot = parseInt(start + (end - start) / 2);
		if (end - start <= 1 || sortFunction(array[pivot], element) == 0)
			return pivot;
		if (sortFunction(array[pivot], element) < 0) {
			return arrayUtil.locationOf(element, array, sortFunction, pivot, end);
		} else {
			return arrayUtil.locationOf(element, array, sortFunction, start, pivot);
		}
	},
	
	/**
	 * Returns the index of the index equivalent to the element compared by the sortFunction
	 *  or returns -1 if nothing is found.
	 * Assuming the array is already sorted by the sortFunction.
	 */
	binarySearch : function(element, array, sortFunction, start, end) {
		sortFunction = sortFunction || function(left, right) {
			return left - right;
		};
		if (array.length > 0) {
			if (sortFunction(element, array[0]) < 0) {
				return -1;
			}
		}
		start = start || 0;
		end = end || array.length;
		var pivot = parseInt(start + (end - start) / 2);
		if (sortFunction(array[pivot], element) == 0) {
		  return pivot;	
		} 
		if (end - start <= 1)
			return -1;
		if (sortFunction(array[pivot], element) < 0) {
			return arrayUtil.binarySearch(element, array, sortFunction, pivot, end);
		} else {
			return arrayUtil.binarySearch(element, array, sortFunction, start, pivot);
		}
	}
};