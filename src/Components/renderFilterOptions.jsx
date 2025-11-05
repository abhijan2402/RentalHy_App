
import React, { useCallback, useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text } from 'react-native';

const RenderFilterOptions = ({
  avaialbleFilter,
  AppliedModalFilter,
  attendedFilter,
  setAttendedFilter,
  setMultiFilter,
  setAppliedModalFilter,
  COLOR,
}) => {

  const handleFilterTap = useCallback(
    filterGroup => {
      setAttendedFilter(filterGroup);
      setMultiFilter(true);
    },
    [setAttendedFilter, setMultiFilter],
  );

  const handleQuickToggle = useCallback(
    (filterGroup) => {
      const updated = { ...AppliedModalFilter };
      if (filterGroup.type === 'price') {
        delete updated.min_price;
        delete updated.max_price;
      } else {
        updated[filterGroup.type] = [];
      }
      setAppliedModalFilter(updated);
    },
    [AppliedModalFilter, setAppliedModalFilter],
  );

  const renderFilterOptions = useCallback(() => {
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {avaialbleFilter.map(filterGroup => {
          const selectedValues = AppliedModalFilter[filterGroup.type] || [];
          let displayText = filterGroup.name;

          if (filterGroup.type === 'price') {
            const minP = AppliedModalFilter.min_price;
            const maxP = AppliedModalFilter.max_price;
            if (minP !== undefined && maxP !== undefined) {
              displayText = `₹${minP} - ₹${maxP}`;
            }
          } else if (selectedValues.length > 0) {
            displayText = selectedValues.join(', ');
          }

          const isActive =
            attendedFilter?.id === filterGroup.id ||
            (filterGroup.type === 'price'
              ? AppliedModalFilter.min_price && AppliedModalFilter.max_price
              : selectedValues.length > 0);

          return (
            <TouchableOpacity
              key={filterGroup.id}
              onPress={() => handleFilterTap(filterGroup)}
              onLongPress={() => handleQuickToggle(filterGroup)} // long press to clear
              style={{
                borderWidth: 1,
                borderColor: isActive ? COLOR.primary : '#ccc',
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 6,
                backgroundColor: isActive ? COLOR.primary : '#fff',
                marginRight: 8,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: isActive ? '#fff' : '#333',
                  textTransform: 'capitalize',
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
    handleFilterTap,
    handleQuickToggle,
  ]);

  const renderedFilters = useMemo(() => renderFilterOptions(), [renderFilterOptions]);

  return renderedFilters;
};

export default RenderFilterOptions;
