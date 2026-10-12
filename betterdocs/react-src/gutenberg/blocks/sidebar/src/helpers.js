export const flattenArray = (values, holder = []) => {
	for( let value of values ) {
		if( value.hasOwnProperty('nested_subcategories') ) {
			holder.push(value);
			flattenArray( value.nested_subcategories[0], holder );
		} else {
			holder.push(value);
		}
	}
	return holder;
}