import React, { useCallback, useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

const RenderFilterOptions = ({
  avaialbleFilter,
  AppliedModalFilter,
  attendedFilter,
  setAttendedFilter,
  setMultiFilter,
  setAppliedModalFilter,
  appliedFilters,
  COLOR,
}) => {



  const renderFilterOptions = useCallback(() => {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {avaialbleFilter.map(filterGroup => {
          const selectedValues = AppliedModalFilter[filterGroup.type] || AppliedModalFilter;
          let displayText = filterGroup.name;

          if (filterGroup.type === 'price' ) {
            const minP = AppliedModalFilter.min_price ;
            const maxP = AppliedModalFilter.max_price ;
            if (minP !== undefined && maxP !== undefined) {
              displayText = `₹${minP} - ₹${maxP}`;
            }
          } else if (selectedValues.length > 0) {
            displayText = selectedValues.join(', ');
          }

          return (
            <TouchableOpacity
              key={filterGroup.id}
              onPress={() => {
                setAttendedFilter(filterGroup);
                setMultiFilter(true);
              }}
              style={{
                borderWidth: 1,
                borderColor: '#ccc',
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
                backgroundColor:
                  attendedFilter?.id == filterGroup?.id
                    ? COLOR.primary
                    : '#fff',
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  paddingVertical: 2,
                  color:
                    attendedFilter?.id == filterGroup?.id
                      ? 'white'
                      : '#333',
                  textTransform: 'capitalize',
                  textAlignVertical: 'center',
                }}>
                {displayText}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  }, [
    avaialbleFilter,
    AppliedModalFilter,
    attendedFilter,
    COLOR,
    setAttendedFilter,
    setMultiFilter,
  ]);

  // Optional memoization to prevent unnecessary recalculation
  const renderedFilters = useMemo(() => renderFilterOptions(), [renderFilterOptions]);

  return renderedFilters;
};

export default RenderFilterOptions;
