import { categories } from "../data/categories";
import { formatDate } from "../helpers";
import { useBudget } from "../hooks/useBudget";
import { Expense } from "../types";
import AmountDisplay from "./AmountDisplay";
import { useMemo } from "react";
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction,
  TrailingActions,
} from "react-swipeable-list";
import "react-swipeable-list/dist/styles.css";

type Props = {
  expense: Expense;
};

const ExpenseDetail = ({ expense }: Props) => {
  const { id, expenseName, amount, category, date } = expense;

  const { dispatch } = useBudget();

  const categoryInfo = useMemo(
    () => categories.find((cat) => cat.id === category),
    [expense]
  );

  const leadingActions = () => (
    <LeadingActions>
      <SwipeAction
        onClick={() => {
          dispatch({ type: "get-expense-by-id", payload: { id: id } });
        }}
      >
        Update
      </SwipeAction>
    </LeadingActions>
  );

  const trailingActions = () => (
    <TrailingActions>
      <SwipeAction
        onClick={() => {
          dispatch({ type: "remove-expense", payload: { id: id } });
        }}
        destructive={true}
      >
        Delete
      </SwipeAction>
    </TrailingActions>
  );

  return (
    <SwipeableList>
      <SwipeableListItem
        maxSwipe={1}
        leadingActions={leadingActions()}
        trailingActions={trailingActions()}
      >
        <div className="bg-white shadow-lg p-10 w-full border-b border-gray-200 flex gap-5 items-center">
          <div>
            <img
              src={`/icono_${categoryInfo?.icon}.svg`}
              alt="expense icon"
              className="w-20"
            />
          </div>
          <div className="flex-1 space-y-2">
            <p className="text-sm font-bold uppercase text-slate-500">
              {categoryInfo?.name}
            </p>
            <p>{expenseName}</p>
            <p className="text-slate-600 text-sm">
              {formatDate(date!.toString())}
            </p>
          </div>
          <AmountDisplay amount={amount} />
        </div>
      </SwipeableListItem>
    </SwipeableList>
  );
};

export default ExpenseDetail;
