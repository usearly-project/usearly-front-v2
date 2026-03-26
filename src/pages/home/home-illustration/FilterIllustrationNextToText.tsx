import FilterIllustration, {
  type FilterIllustrationProps,
} from "./FilterIllustration";
import { getFilterIllustrationContent } from "./filterIllustrationContent";
import "./FilterIllustrationNextToText.scss";

export type FilterIllustrationNextToTextProps = FilterIllustrationProps;
type Props = FilterIllustrationNextToTextProps;

const toModifier = (value: string) =>
  value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

const FilterIllustrationNextToText = ({
  filter,
  onglet = "report",
  withText = false,
  selectedBrand,
  selectedCategory,
  ...illustrationProps
}: Props) => {
  const shouldShowText = withText && !selectedBrand && !selectedCategory;
  const { key: resolvedFilter, content } = getFilterIllustrationContent(
    filter,
    onglet,
  );

  if (!shouldShowText) {
    return (
      <FilterIllustration
        {...illustrationProps}
        filter={filter}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        onglet={onglet}
      />
    );
  }

  const className = [
    "filter-illustration-next-to-text",
    `filter-illustration-next-to-text--${toModifier(onglet)}`,
    `filter-illustration-next-to-text--${toModifier(resolvedFilter)}`,
    content.className,
  ].join(" ");

  return (
    <div className={className}>
      <div className="filter-illustration-next-to-text__text">
        <h3 className="filter-illustration-next-to-text__title">
          {content.title}
        </h3>
        {/* <p className="filter-illustration-next-to-text__description">
          {content.description}
        </p> */}
      </div>

      <FilterIllustration
        {...illustrationProps}
        filter={filter}
        selectedBrand={selectedBrand}
        selectedCategory={selectedCategory}
        onglet={onglet}
        withText
      />
    </div>
  );
};

export default FilterIllustrationNextToText;
